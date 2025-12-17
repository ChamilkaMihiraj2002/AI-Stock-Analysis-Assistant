# AI Stock Analysis Assistant

An intelligent stock analysis application powered by AI. This full-stack application combines a modern React frontend with a FastAPI backend to provide conversational, AI-driven financial insights using Google Generative AI and real-time stock data.

## 📋 Overview

The AI Stock Analysis Assistant is a sophisticated financial analysis tool that leverages:
- **Google Generative AI (Gemini)** for intelligent stock analysis and market insights
- **Real-time stock data** via YFinance for accurate pricing and historical trends
- **Interactive chat interface** for natural language queries about stocks
- **Automatic chart generation** for visual stock performance analysis
- **Agent-based architecture** with LangChain for intelligent decision-making

Users can ask natural questions about stocks, get AI-powered analysis, view charts, and receive actionable financial insights in a conversational format.

## ✨ Features

### Frontend (React + TypeScript)
- 💬 Conversational chat interface for stock inquiries
- 📊 Real-time chart visualization embedded in chat
- ⚡ Fast, responsive UI with Vite
- 📱 Mobile-friendly design
- 🎯 Starter prompts for quick analysis
- 📈 Stock ticker highlights with performance metrics

### Backend (FastAPI + Python)
- 🤖 AI-powered stock analysis using Google Generative AI
- 📈 Real-time stock price fetching with YFinance
- 📊 Automatic chart generation and encoding
- 🔄 LangChain agent framework for intelligent queries
- 🔌 RESTful API with streaming responses
- 🛡️ CORS enabled for frontend integration
- 💾 In-memory session management with LangGraph

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + TypeScript)             │
│                  Running on localhost:5173                  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Chat Interface (App.tsx)                  │ │
│  │  • Message input and history                           │ │
│  │  • Real-time chart display                             │ │
│  │  • Starter prompts                                     │ │
│  │  • Stock ticker highlights                             │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST (CORS enabled)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend (FastAPI + Python)                  │
│                  Running on localhost:8000                  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FastAPI Server (app.py)                   │ │
│  │  • /api/chat endpoint                                  │ │
│  │  • Streaming responses                                 │ │
│  │  • CORS middleware                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                 │
│        ┌──────────────────┼──────────────────┐              │
│        ▼                  ▼                  ▼              │
│   ┌─────────┐      ┌──────────┐      ┌────────────┐         │
│   │LangChain│      │Google AI │      │ YFinance   │         │
│   │Agent    │      │ (Gemini) │      │(Stock Data)│         │
│   └─────────┘      └──────────┘      └────────────┘         │
│        │                                     │              │
│        └──────────────────────┬──────────────┘              │
│                               ▼                             │
│                        ┌─────────────┐                      │
│                        │ Matplotlib  │                      │
│                        │(Charts)     │                      │
│                        └─────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** 5.9 - Type-safe JavaScript
- **Vite** 7.2.4 - Lightning-fast build tool
- **@crayonai/react-ui** 0.9.8 - UI components
- **@thesysai/genui-sdk** 0.7.11 - AI UI components
- **ESLint** - Code quality

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **LangChain** - AI agent framework
- **LangGraph** - Agent state management
- **Google Generative AI** - Gemini API integration
- **YFinance** - Stock data fetching
- **Matplotlib** - Chart generation
- **python-dotenv** - Environment management

## 📦 Project Structure

```
AI-Stock-Analysis-Assistant/
├── Frontend/                          # React TypeScript application
│   ├── src/
│   │   ├── App.tsx                   # Main chat component
│   │   ├── App.css                   # Application styles
│   │   ├── main.tsx                  # Entry point
│   │   └── assets/                   # Static assets
│   ├── public/                        # Public files
│   ├── package.json                   # NPM dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── vite.config.ts                 # Vite configuration
│   ├── eslint.config.js               # ESLint rules
│   └── README.md                      # Frontend documentation
│
├── Backend/                           # FastAPI application
│   ├── app.py                         # Main FastAPI server
│   ├── requirements.txt               # Python dependencies
│   └── README.md                      # Backend documentation
│
├── README.md                          # This file
└── LICENSE                            # MIT License
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm (for frontend)
- **Python** 3.8+ (for backend)
- **Google Generative AI API Key** (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Stock-Analysis-Assistant
```

#### 2. Backend Setup
```bash
cd Backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "GOOGLE_API_KEY=your_api_key_here" > .env
```

#### 3. Frontend Setup
```bash
cd ../Frontend

# Install dependencies
npm install
```

### Running the Application

#### Terminal 1: Start Backend
```bash
cd Backend
source venv/bin/activate  # If not already activated
python app.py
```
Backend will be available at `http://localhost:8000`

#### Terminal 2: Start Frontend
```bash
cd Frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Verify Everything Works
1. Open `http://localhost:5173` in your browser
2. Try a starter prompt like "Give me a quick read on AAPL today"
3. You should see the chat interface with AI responses and charts

## 📚 Documentation

For detailed information about each component, see:
- **[Backend README](Backend/README.md)** - FastAPI server setup, API endpoints, and tools
- **[Frontend README](Frontend/README.md)** - React app structure, components, and styling

## 🔌 API Endpoints

### Chat Endpoint
**POST** `/api/chat`

**Request:**
```json
{
  "message": "What is the current price of AAPL?"
}
```

**Response:**
- Streaming text response with optional base64-encoded chart images
- Error handling for invalid queries

See [Backend README](Backend/README.md) for complete API documentation.

## 🎯 Usage Examples

### Example Queries
- "Give me a quick read on AAPL today with key catalysts."
- "Compare TSLA and NIO performance over the last 6 months."
- "What ETFs give me the best exposure to AI chips right now?"
- "Summarize the latest earnings call sentiment for MSFT."

### Features in Action
- Ask about specific stocks and get real-time prices
- Request comparisons between multiple stocks
- Get sector and ETF analysis
- View auto-generated price charts
- Receive AI-powered market insights

## 🛡️ Environment Variables

### Backend (.env)
```
GOOGLE_API_KEY=your_google_api_key_here
```

### Frontend (optional)
```
VITE_API_URL=http://localhost:8000
```

## 🔧 Development

### Backend Development
```bash
cd Backend
source venv/bin/activate
python app.py --reload
```

### Frontend Development
```bash
cd Frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
cd Backend
python app.py  # Standard production mode
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

## 📊 Available Tools

The backend exposes these tools through the AI agent:

- **`get_stock_price`** - Fetch current stock price for a ticker
- **`get_stock_chart`** - Generate a stock price chart visualization
- **`analyze_stock`** - Get AI-powered analysis of a stock

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Change the port in `app.py`
- **Module not found**: Run `pip install -r requirements.txt` again
- **API key error**: Verify `GOOGLE_API_KEY` in `.env` is correct

### Frontend Issues
- **API connection error**: Ensure backend is running on `localhost:8000`
- **CORS errors**: Check backend CORS configuration in `app.py`
- **Charts not displaying**: Verify backend response format includes base64 images

### General
- Clear browser cache: `Ctrl+Shift+Delete` (Cmd+Shift+Delete on Mac)
- Check browser console for JavaScript errors
- Check terminal output for backend errors

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows project style guidelines
- Tests pass (if applicable)
- Documentation is updated
- No security vulnerabilities are introduced

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues, questions, or suggestions:
1. Check the [Backend README](Backend/README.md) and [Frontend README](Frontend/README.md) for specific guidance
2. Review existing GitHub issues
3. Create a new GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment details (OS, Node/Python versions)

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [React](https://react.dev/) - UI library
- [Google Generative AI](https://ai.google/) - AI capabilities
- [LangChain](https://www.langchain.com/) - Agent framework
- [YFinance](https://finance.yahoo.com/) - Financial data

---

**Built with ❤️ for financial analysis enthusiasts**