# HumAI Project
  
A comprehensive full-stack health analysis system built with React frontend and Node.js backend, integrated with Firebase services.

## Project Overview

HumAI is a modern web application focused on health monitoring and analysis, featuring:
- User health data management
- Symptom checking and analysis
- Health awareness articles
- AI-powered chatbot assistance
- Administrative dashboard

## Project Structure

```
├── frontend/           # React frontend (Vite)
│   ├── src/
│   │   ├── admin/     # Admin panel components
│   │   ├── components/ # Reusable UI components
│   │   ├── context/   # React context providers
│   │   ├── pages/     # Page components
│   │   ├── services/  # API integration
│   │   └── utils/     # Utility functions
├── backend/           # Node.js backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   └── services/      # Business logic
├── firebase/          # Firebase configuration
├── functions/         # Firebase Cloud Functions
└── scripts/          # Utility scripts
```

## Core Features

### Health Analysis System
- Symptom checking and analysis
- Health data visualization
- Personal health records
- Health awareness articles

### User Management
- Secure authentication
- Role-based access control
- User profile management
- Data privacy protection

### AI Integration
- AI-powered health chatbot
- Symptom analysis
- Health recommendations
- Natural language processing

## Technology Stack

### Frontend
- React with Vite
- Tailwind CSS
- Firebase Authentication
- Context API for state management

### Backend
- Node.js with Express
- Firebase Admin SDK
- MongoDB with Mongoose
- JWT authentication

### Cloud Services
- Firebase Authentication
- Firestore Database
- Firebase Cloud Functions
- Firebase Hosting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project setup
- MongoDB instance

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Configure environment variables:

```env
# Frontend Variables
VITE_APP_FIREBASE_API_KEY=
VITE_APP_FIREBASE_AUTH_DOMAIN=
VITE_APP_FIREBASE_PROJECT_ID=
VITE_APP_FIREBASE_STORAGE_BUCKET=
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=
VITE_APP_FIREBASE_APP_ID=

# Backend Variables
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_CLIENT_X509_CERT_URL=
PORT=
NODE_ENV=
FRONTEND_URL=
```

### Installation

1. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. Start development servers:
```bash
# Start frontend (from frontend directory)
npm run dev

# Start backend (from backend directory)
npm run dev
```

## Production Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Security Features

- Helmet.js for secure HTTP headers
- Rate limiting protection
- CORS configuration
- JWT authentication
- Role-based access control
- Environment validation
- Secure credential management

## Development Guidelines

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript types
- Component-based architecture

### Testing
- Jest for unit testing
- API endpoint testing
- Component testing
- Integration testing

### Logging
- Winston-based logging
- Environment-specific levels
- Structured log format
- Error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the ISC License.

## Security Notes

- Never commit `.env` files
- Keep API keys secure
- Use environment variables
- Follow security best practices
- Regular security audits