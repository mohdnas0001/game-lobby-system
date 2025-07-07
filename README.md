# Game Lobby System

## Overview
This project is a simple game lobby system built as part of an assignment. It allows users to register/login with a username, join a game session, pick a number (1-10), and compete to win based on a randomly chosen number. The backend manages authentication, game sessions, and a leaderboard, while the frontend provides a user-friendly interface for interaction.

### Features
- **User Authentication**: Register and login using JWT with a simple username input.
- **Game Lobby Management**:
  - Users can join an active game session (20-second duration).
  - No new players can join after the session ends until the next session starts.
- **Game Mechanics**:
  - Users pick a number (1-10) upon joining a session.
  - A random winning number is chosen at the end of the session.
  - Players who picked the correct number are declared winners.
  - Game sessions are stored in MongoDB.
  - API endpoint to fetch the top 10 players sorted by wins.
- **Frontend Pages**:
  - **Authentication Page**: Input form for username to register/login.
  - **Home Page**: Button to join the current session and a countdown timer.
  - **Game Page**: Number selection (1-10) and win/lose message at session end.
- **Leaderboard**: Displays top 10 players with icons (Trophy, Medal, Award) for top 3.

## Tech Stack
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, TanStack Query, Lucide Icons
- **Backend**: Node.js, Express, MongoDB, JWT for authentication
- **Hosting**:
  - Frontend: Vercel
  - Backend: Render
- **Other**: Axios for API calls, Socket.IO for real-time updates (optional WebSocket integration)

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- Yarn or npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Vercel account for frontend hosting
- Render account for backend hosting
- GitHub account for repository management

### Backend Setup
1. **Clone the Backend Repository**:
   ```bash
   git clone https://github.com/your-username/game-lobby-backend.git
   cd game-lobby-backend

2. **Install Dependencies**:
   ```bash
   yarn install

2. **Configure Environment Variabless**:
Create a .env file in the backend root:
```bash
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/game-lobby
    JWT_SECRET=your_jwt_secret_here
```
Replace MONGODB_URI with your MongoDB connection string.

Generate a secure JWT_SECRET.
