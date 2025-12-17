# AI Stock Analysis Assistant - Backend

The backend of the AI Stock Analysis Assistant is a FastAPI-based server that provides intelligent stock analysis powered by Google Generative AI and financial data from YFinance.

## Features

- **AI-Powered Stock Analysis**: Uses Google Generative AI (Gemini 2.5 Flash Lite) to analyze stock data
- **Real-Time Stock Data**: Fetches live stock prices and historical data using YFinance
- **Agent-Based Architecture**: Implements LangChain agents for intelligent decision-making
- **Chart Generation**: Creates stock price visualizations as base64-encoded images
- **CORS Enabled**: Full cross-origin resource sharing for frontend integration
- **Streaming Responses**: Server-sent events for real-time data streaming

## Tech Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **AI/LLM**: Google Generative AI (LangChain integration)
- **Financial Data**: YFinance
- **Agent Framework**: LangGraph
- **Visualization**: Matplotlib
- **Environment Management**: python-dotenv

## Prerequisites

- Python 3.8+
- Google Generative AI API Key (from [Google AI Studio](https://aistudio.google.com))
- pip package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Stock-Analysis-Assistant/Backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the Backend directory:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

## Running the Server

Start the development server:
```bash
python app.py
```

The server will start on `http://localhost:8000`

### Alternative: Using Uvicorn directly
```bash
uvicorn app:app --reload
```

For production, use:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Available Tools

The backend provides the following tools for stock analysis:

### `get_stock_price`
Retrieves the current stock price based on a ticker symbol.
- **Input**: `ticker` (string) - Stock ticker symbol (e.g., "AAPL", "GOOGL")
- **Output**: Current stock price as a float

### `get_stock_chart`
Generates a stock price chart for visualization.
- **Input**: `ticker` (string) - Stock ticker symbol
- **Output**: Base64-encoded PNG image of the chart

### `analyze_stock`
Provides AI-powered analysis of stock data.
- **Input**: `ticker` (string) - Stock ticker symbol
- **Output**: Detailed analysis from Google Generative AI

## Architecture

The application uses:
- **FastAPI** for REST API endpoints
- **LangChain** for AI agent orchestration
- **LangGraph** with in-memory checkpointing for conversation state management
- **Google Generative AI** for intelligent stock analysis
- **YFinance** for real-time and historical stock data
- **Matplotlib** for chart generation

## Environment Setup

### Google API Key
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Add it to your `.env` file as `GOOGLE_API_KEY`

## Common Issues

### Module Not Found Errors
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### CORS Errors
CORS is already configured in the app. Ensure your frontend is making requests to the correct backend URL.

### Chart Generation Issues
The backend uses headless matplotlib rendering. If you encounter display issues, ensure the `matplotlib.use('Agg')` setting is in place (it is by default).

## Development

To modify the backend:
1. Edit files in the Backend directory
2. The server will auto-reload if running with `--reload` flag
3. Test endpoints using Swagger UI or your frontend

## Future Enhancements

- Database integration for persistent data storage
- WebSocket support for real-time updates
- Additional technical analysis indicators
- Portfolio management features
- User authentication and authorization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please create an issue in the repository.
