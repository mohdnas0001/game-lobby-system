Game Lobby System

Overview

This project is a simple game lobby system built as part of an assignment. It allows users to register/login with a username, join a game session, pick a number (1-10), and compete to win based on a randomly chosen number. The backend manages authentication, game sessions, and a leaderboard, while the frontend provides a user-friendly interface for interaction.

Features





User Authentication: Register and login using JWT with a simple username input.



Game Lobby Management:





Users can join an active game session (20-second duration).



No new players can join after the session ends until the next session starts.



Game Mechanics:





Users pick a number (1-10) upon joining a session.



A random winning number is chosen at the end of the session.



Players who picked the correct number are declared winners.



Game sessions are stored in MongoDB.



API endpoint to fetch the top 10 players sorted by wins.



Frontend Pages:





Authentication Page: Input form for username to register/login.



Home Page: Button to join the current session and a countdown timer.



Game Page: Number selection (1-10) and win/lose message at session end.



Leaderboard: Displays top 10 players with icons (Trophy, Medal, Award) for top 3.

Tech Stack





Frontend: React (TypeScript), Vite, Tailwind CSS, TanStack Query, Lucide Icons



Backend: Node.js, Express, MongoDB, JWT for authentication



Hosting:





Frontend: Vercel



Backend: Render



Other: Axios for API calls, Socket.IO for real-time updates (optional WebSocket integration)

Setup Instructions

Prerequisites





Node.js (v18 or later)



Yarn or npm



MongoDB (local or cloud, e.g., MongoDB Atlas)



Vercel account for frontend hosting



Render account for backend hosting



GitHub account for repository management

Backend Setup





Clone the Backend Repository:

git clone https://github.com/your-username/game-lobby-backend.git
cd game-lobby-backend



Install Dependencies:

yarn install



Configure Environment Variables:





Create a .env file in the backend root:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/game-lobby
JWT_SECRET=your_jwt_secret_here



Replace MONGODB_URI with your MongoDB connection string (e.g., MongoDB Atlas).



Generate a secure JWT_SECRET (e.g., using openssl rand -base64 32).



Run the Backend Locally:

yarn start





The backend will run on http://localhost:5000.



Deploy to Render:





Push the backend repository to GitHub.



Create a new Web Service on Render:





Connect your GitHub repository.



Set environment variables (PORT, MONGODB_URI, JWT_SECRET).



Build Command: yarn install



Start Command: yarn start



Deploy to get the URL (e.g., https://game-lobby-backend-9d4k.onrender.com).

Frontend Setup





Clone the Frontend Repository:

git clone https://github.com/your-username/game-lobby-frontend.git
cd game-lobby-frontend



Install Dependencies:

yarn install



Configure Environment Variables:





Create a .env file in the frontend root:

VITE_API_URL=https://game-lobby-backend-9d4k.onrender.com



Run the Frontend Locally:

yarn dev





The frontend will run on http://localhost:3000.



Deploy to Vercel:





Push the frontend repository to GitHub.



Create a new project on Vercel:





Import the game-lobby-frontend repository.



Set Framework Preset to Vite.



Add environment variable VITE_API_URL=https://game-lobby-backend-9d4k.onrender.com.



Build Command: yarn build



Output Directory: dist



Install Command: yarn install



Deploy to get the URL (e.g., https://game-lobby-frontend.vercel.app).

Running Locally





Start the backend: cd game-lobby-backend && yarn start



Start the frontend: cd game-lobby-frontend && yarn dev



Open http://localhost:3000 to access the app.



Ensure MongoDB is running locally or use a cloud instance.

Testing





Unit Tests (Frontend):

cd game-lobby-frontend
yarn test



End-to-End Tests (if implemented):

yarn e2e-test



Backend Tests (if implemented):

cd game-lobby-backend
yarn test

API Endpoints





Authentication:





POST /auth/register: Register a user with { username }.



POST /auth/login: Login a user with { username }, returns JWT.



Game Lobby:





POST /game/join: Join the active session with { number } (1-10), requires JWT.



GET /game/leaderboard: Fetch top 10 players sorted by wins, requires JWT.



WebSocket (optional):





Connect to / with Socket.IO for real-time session updates (countdown, results).

Approach





Authentication: Uses JWT for secure user authentication. Tokens are stored in localStorage and sent in the Authorization header for API requests.



Game Lobby: Managed by the backend with MongoDB to store sessions. A session runs for 20 seconds, during which users can join and pick a number. After the session ends, a random winning number is chosen, and winners are updated in the database.



Frontend: Built with React, TypeScript, and Vite for fast development and builds. TanStack Query handles API calls and caching. Tailwind CSS and Lucide Icons provide a modern UI.



Real-Time Updates: Uses Socket.IO for real-time countdown and result notifications (optional enhancement).



Leaderboard: Fetches top 10 players sorted by wins, with UI enhancements like icons and badges for top 3.



Hosting: Backend on Render for scalability, frontend on Vercel for speed and simplicity. CORS is configured to allow communication between the two.

Demo Link

Live Demo
Note: Replace with the actual Vercel URL after deployment.

Repository





Frontend: https://github.com/your-username/game-lobby-frontend



Backend: https://github.com/your-username/game-lobby-backend

Future Improvements





Add real-time session updates using Socket.IO for all clients.



Implement E2E tests for frontend and backend.



Add pagination for leaderboard.



Enhance UI with animations and better error handling.