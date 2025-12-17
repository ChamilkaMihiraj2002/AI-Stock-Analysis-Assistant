from dotenv import load_dotenv
from pydantic import BaseModel

import uvicorn
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from langchain.agents import create_agent
from langchain.tools import tool
from langchain.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import InMemorySaver

from google.genai import errors as genai_errors

import yfinance as yf
import base64
from io import BytesIO
import matplotlib

matplotlib.use('Agg')  # Headless rendering for server environments
import matplotlib.pyplot as plt

load_dotenv() 

app = FastAPI()

# --- UPDATED MODEL SETUP ---
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite", 
    temperature=0
)

checkpointer = InMemorySaver()

@tool('get_stock_price', description='A function that returns the current stock price based on a ticker symbol.')
def get_stock_price(ticker: str):
    print('get_stock_price tool is being used')
    stock = yf.Ticker(ticker)

    # Try to retrieve the latest close price robustly
    price = None
    try:
        hist = stock.history()
        if not hist.empty:
            price = hist['Close'].iloc[-1]
    except Exception:
        price = None

    # Fallback to fast_info or info
    if price is None:
        try:
            fast = getattr(stock, 'fast_info', None)
            if fast and isinstance(fast, dict):
                price = fast.get('last_price') or fast.get('last_close')
        except Exception:
            price = None

    # Get a readable company name if available
    name = None
    try:
        info = getattr(stock, 'info', {}) or {}
        name = info.get('shortName') or info.get('longName')
    except Exception:
        name = None

    symbol = (ticker or '').upper()

    if price is None:
        return f'No price data available for {symbol}.'

    # Format price to 2 decimals
    try:
        formatted = f"${price:,.2f}"
    except Exception:
        formatted = str(price)

    if name:
        return f'The current stock price of {name} ({symbol}) is {formatted}.'
    return f'The current stock price of {symbol} is {formatted}.'


@tool('get_historical_stock_price', description='A function that returns the current stock price over time based on a ticker symbol and a start and end date.')
def get_historical_stock_price(ticker: str, start_date: str, end_date: str):
    print('get_historical_stock_price tool is being used')
    stock = yf.Ticker(ticker)
    return stock.history(start=start_date, end=end_date).to_dict()


@tool('get_balance_sheet', description='A function that returns the balance sheet based on a ticker symbol.')
def get_balance_sheet(ticker: str):
    print('get_balance_sheet tool is being used')
    stock = yf.Ticker(ticker)
    return stock.balance_sheet


@tool('get_stock_news', description='A function that returns news based on a ticker symbol.')
def get_stock_news(ticker: str):
    print('get_stock_news tool is being used')
    stock = yf.Ticker(ticker)
    raw = stock.news

    if not raw:
        return f'No recent news found for {ticker.upper()}.'

    # Normalize and build a concise, user-friendly summary (top 5 items)
    items = raw[:5]
    lines = [f'Here are the latest updates for {ticker.upper()}:']

    for it in items:
        # items from yfinance may be nested (e.g., {'content': {...}}) or flat
        entry = it.get('content') if isinstance(it, dict) and it.get('content') else it

        title = None
        provider = None
        time = None
        url = None

        if isinstance(entry, dict):
            title = entry.get('title') or entry.get('summary') or entry.get('description')
            provider = None
            # provider could be nested under 'provider' or 'provider.displayName'
            prov = entry.get('provider') or entry.get('publisher') or entry.get('source')
            if isinstance(prov, dict):
                provider = prov.get('displayName') or prov.get('name')
            else:
                provider = prov

            time = entry.get('displayTime') or entry.get('pubDate')
            # canonicalUrl may be nested
            can = entry.get('canonicalUrl') or entry.get('clickThroughUrl')
            if isinstance(can, dict):
                url = can.get('url')
            else:
                url = can

        # Fallback for non-dict entries
        title = title or (entry if isinstance(entry, str) else None) or 'No title'
        provider = provider or 'Unknown source'
        time = time or ''

        # Shorten time for readability (keep as-is if not present)
        time_str = f"[{time}] " if time else ''

        if url:
            lines.append(f'- {time_str}{title} ({provider}) — {url}')
        else:
            lines.append(f'- {time_str}{title} ({provider})')

    return '\n'.join(lines)

@tool('render_stock_chart', description='Render a price chart for a ticker over a given period. Returns a data URI (PNG).')
def render_stock_chart(ticker: str, period: str = '6mo', interval: str = '1d'):
    print('render_stock_chart tool is being used')
    history = yf.Ticker(ticker).history(period=period, interval=interval)

    if history.empty:
        return f'No price data available for {ticker}.'

    fig, ax = plt.subplots(figsize=(8, 3))
    ax.plot(history.index, history['Close'], color='#4af3c3', linewidth=2)
    ax.set_title(f'{ticker.upper()} close price', color='#e9f0f8')
    ax.set_ylabel('Price (USD)', color='#97a7c3')
    ax.grid(alpha=0.2)
    ax.tick_params(colors='#97a7c3')
    fig.tight_layout()

    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=160, bbox_inches='tight', facecolor='#040a12')
    plt.close(fig)
    buffer.seek(0)

    encoded = base64.b64encode(buffer.read()).decode('utf-8')
    return f'data:image/png;base64,{encoded}'

agent = create_agent(
    model = model,
    checkpointer = checkpointer,
    tools = [
        get_stock_price,
        get_historical_stock_price,
        get_balance_sheet,
        get_stock_news,
        render_stock_chart
    ]
)

class PromptObject(BaseModel):
    content: str
    id: str
    role: str


class RequestObject(BaseModel):
    prompt: PromptObject
    threadId: str
    responseId: str


@app.post('/api/chat')
async def chat(request: RequestObject):
    config = {'configurable': {'thread_id': request.threadId}}

    def generate():
        try:
            for token, _ in agent.stream(
                {'messages': [
                    SystemMessage(
                        'You are a stock analysis assistant. You can stream answers, fetch real-time stock '
                        'prices, historical prices (with date range), news, balance sheet data, and also '
                        'render quick PNG price charts via the render_stock_chart tool. If you return a '
                        'data URI image, present it as markdown so the client can display the chart.'
                    ),
                    HumanMessage(request.prompt.content)
                ]},
                stream_mode='messages',
                config=config
            ):
                yield token.content
        except genai_errors.ClientError as err:
            if getattr(err, 'code', None) == 429 or 'quota' in str(err).lower():
                yield '⚠️ Model quota exhausted. Please retry shortly or upgrade your plan.'
            else:
                yield f'⚠️ Upstream client error: {err}'
        except Exception as err:  # fallback to avoid crashing the SSE stream
            yield f'⚠️ Unexpected server error: {err}'

    return StreamingResponse(generate(), media_type='text/event-stream',
                             headers={
                                 'Cache-Control': 'no-cache, no-transform',
                                 'Connection': 'keep-alive',
                             })

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8888)