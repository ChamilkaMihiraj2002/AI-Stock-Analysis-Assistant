# AI Stock Analysis Assistant - Frontend

A modern, responsive React-based frontend for the AI Stock Analysis Assistant. This application provides an intuitive chat interface for AI-powered stock analysis with real-time chart visualization and intelligent financial insights.

## Features

- **Conversational AI Chat**: Ask questions about stocks in natural language
- **Real-Time Stock Analysis**: Get AI-powered insights on stock performance and trends
- **Interactive Charts**: View stock price visualizations directly in the chat
- **Starter Prompts**: Quick access to common analysis queries
- **Highlighted Tickers**: Display trending stocks with current performance metrics
- **Message History**: Full conversation history with automatic scrolling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI Components**: Built with CrayonAI React UI and GenUI SDK

## Tech Stack

- **Frontend Framework**: React 19.2
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **UI Libraries**: 
  - @crayonai/react-ui (0.9.8)
  - @thesysai/genui-sdk (0.7.11)
- **Development**: ESLint, TypeScript strict mode

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Backend API running on localhost:8000 (configurable)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Stock-Analysis-Assistant/Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - Update the `API_URL` in [src/App.tsx](src/App.tsx) if your backend runs on a different address

## Running the Application

### Development Server
Start the development server with hot module replacement (HMR):
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── App.tsx          # Main application component with chat interface
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── assets/          # Static assets
public/              # Public static files
```

## Key Components

### Chat Interface (`App.tsx`)
The main component that provides:
- Message input with text area
- Message history display with user and assistant messages
- Real-time API communication
- Image/chart rendering from API responses
- Error handling and loading states
- Starter prompts for quick interactions

### Message Structure
```typescript
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
  error?: boolean
}
```

### Starter Prompts
Predefined prompts to help users get started:
- Stock analysis queries
- Multi-stock comparisons
- ETF and sector analysis
- Earnings sentiment analysis

## API Integration

The frontend communicates with the backend API at `/api/chat`:

**Request**:
```json
{
  "message": "User query about stocks"
}
```

**Response**:
- Streaming text responses
- Base64-encoded chart images embedded in responses
- Error messages for failed requests

## Styling

The application uses custom CSS ([App.css](src/App.css)) for:
- Chat interface layout
- Message styling (user vs. assistant)
- Chart display
- Responsive design
- Color schemes for different message types

## Development

### Linting
Check code quality:
```bash
npm run lint
```

### TypeScript
The project uses strict TypeScript checking:
```bash
npm run build
```

This compiles TypeScript before building.

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

If needed, create a `.env` file:
```
VITE_API_URL=http://localhost:8000
```

Then update [src/App.tsx](src/App.tsx) to use it:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api/chat'
```

## Performance Optimization

- Vite provides fast HMR and optimized builds
- React 19 optimizations are built-in
- Code splitting happens automatically during build
- Images are embedded as base64 for immediate display

## Common Issues

### API Connection Issues
- Ensure the backend server is running on the correct port
- Check CORS configuration in the backend
- Verify `API_URL` in [src/App.tsx](src/App.tsx) matches your backend address

### Chart Images Not Displaying
- Check browser console for errors
- Verify the backend is correctly generating base64-encoded images
- Ensure image content is properly formatted in the response

### ESLint Warnings
Run `npm run lint` to identify and fix linting issues:
```bash
npm run lint
```

## Future Enhancements

- User authentication and account management
- Saved analysis history and favorites
- Portfolio tracking and watchlists
- Advanced chart controls (zoom, pan, date range selection)
- Real-time price alerts
- Export analysis reports as PDF

## Contributing

When contributing:
1. Follow TypeScript strict mode guidelines
2. Run linting before committing: `npm run lint`
3. Test changes in both development and production builds
4. Update this README if adding new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please create an issue in the repository.
