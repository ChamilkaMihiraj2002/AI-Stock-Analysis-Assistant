import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
  error?: boolean
}

const API_URL = '/api/chat'

const generateId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`

const starterPrompts = [
  'Give me a quick read on AAPL today with key catalysts.',
  'Compare TSLA and NIO performance over the last 6 months.',
  'What ETFs give me the best exposure to AI chips right now?',
  'Summarize the latest earnings call sentiment for MSFT.'
]

const highlightTickers = [
  { symbol: 'AAPL', change: '+1.14%', mood: 'bullish' },
  { symbol: 'TSLA', change: '-0.42%', mood: 'watch' },
  { symbol: 'NVDA', change: '+2.61%', mood: 'momentum' }
]

const renderMessageContent = (content: string) => {
  const imageMatches = content.match(/data:image[^)\s]+/g) ?? []
  const uniqueImages = Array.from(new Set(imageMatches))
  const textOnly = content.replace(/!\[[^\]]*\]\((data:image[^)\s]+)\)/g, '').replace(/data:image[^)\s]+/g, '').trim()

  return (
    <>
      {textOnly && <p className='content-text'>{textOnly}</p>}
      {uniqueImages.map((src) => (
        <img key={src.slice(-24)} src={src} className='content-image' alt='Generated chart' />
      ))}
    </>
  )
}

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId('assistant'),
      role: 'assistant',
      content:
        'Hi, I am your market copilot. Ask me about tickers, earnings, news, or have me compare historical performance. I stream results live.',
      ts: Date.now()
    }
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [errorNote, setErrorNote] = useState<string | null>(null)
  const [threadId] = useState(() => `thread-${generateId('session')}`)
  const streamAbortRef = useRef<AbortController | null>(null)
  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!feedRef.current) return
    feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const appendMessage = (msg: Message) => setMessages((prev) => [...prev, msg])

  const updateAssistantMessage = (id: string, chunk: string, asError = false) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, content: m.content + chunk, error: asError ? true : m.error }
          : m
      )
    )
  }

  const stopStreaming = () => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort()
      streamAbortRef.current = null
    }
    setIsStreaming(false)
  }

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || isStreaming) return

    setErrorNote(null)

    const userMessage: Message = {
      id: generateId('user'),
      role: 'user',
      content,
      ts: Date.now()
    }

    const assistantMessageId = generateId('assistant')
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      ts: Date.now()
    }

    appendMessage(userMessage)
    appendMessage(assistantMessage)
    setInput('')
    setIsStreaming(true)

    const controller = new AbortController()
    streamAbortRef.current = controller

    try {
      const payload = {
        prompt: {
          content,
          id: userMessage.id,
          role: 'user'
        },
        threadId,
        responseId: assistantMessageId
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      if (!response.ok || !response.body) {
        throw new Error('Unable to reach the market assistant right now.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        if (chunk) {
          updateAssistantMessage(assistantMessageId, chunk)
        }
      }
    } catch (err) {
      const fallback = err instanceof Error ? err.message : 'Unexpected error.'
      setErrorNote(fallback)
      updateAssistantMessage(
        assistantMessageId,
        `\n⚠️ ${fallback} — try again in a moment.`,
        true
      )
    } finally {
      setIsStreaming(false)
      streamAbortRef.current = null
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className='page-shell'>
      <div className='aurora' />
      <div className='layout'>
        <aside className='sidebar'>
          <div className='brand-card'>
            <div className='pill live'>Live • SSE</div>
            <h1>Stock Insight Copilot</h1>
            <p>
              Built for 2025 workflows: fast streaming answers, ticker-aware tools, and actionable
              breakdowns.
            </p>
            <div className='mini-grid'>
              <div>
                <span className='label'>Latency</span>
                <strong>~1.4s</strong>
              </div>
              <div>
                <span className='label'>Coverage</span>
                <strong>Equities • ETFs</strong>
              </div>
              <div>
                <span className='label'>Signals</span>
                <strong>Price • News • Balance</strong>
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='card-head'>Quick prompts</div>
            <div className='chip-row'>
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className='chip'
                  type='button'
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className='card'>
            <div className='card-head'>Radar</div>
            <div className='ticker-list'>
              {highlightTickers.map((item) => (
                <div key={item.symbol} className='ticker-row'>
                  <div className='ticker-symbol'>{item.symbol}</div>
                  <div className='ticker-change'>{item.change}</div>
                  <div className='ticker-mood'>{item.mood}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className='chat-panel'>
          <header className='chat-header'>
            <div>
              <p className='eyebrow'>Next-gen research lane</p>
              <h2>Ask, stream, decide.</h2>
            </div>
            <div className='status'>
              <span className='dot' />
              <span>{isStreaming ? 'Responding' : 'Ready'}</span>
            </div>
          </header>

          <div className='chat-feed' ref={feedRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bubble ${message.role === 'user' ? 'user' : 'assistant'} ${
                  message.error ? 'error' : ''
                }`}
              >
                <div className='meta'>
                  <span className='who'>{message.role === 'user' ? 'You' : 'Copilot'}</span>
                  <span className='time'>{new Date(message.ts).toLocaleTimeString()}</span>
                </div>
                <div className='content'>
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
          </div>

          <form className='composer' onSubmit={handleSubmit}>
            <div className='composer-inner'>
              <textarea
                value={input}
                placeholder='Ask about a ticker, compare companies, or request news…'
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
              />
              <div className='composer-actions'>
                {isStreaming && (
                  <button type='button' className='ghost' onClick={stopStreaming}>
                    Stop
                  </button>
                )}
                <button type='submit' className='primary' disabled={!input.trim() || isStreaming}>
                  Send
                </button>
              </div>
            </div>
            {errorNote && <div className='error-note'>{errorNote}</div>}
          </form>
        </main>
      </div>
    </div>
  )
}

export default App