# Game Lobby System

A simple real-time game lobby where users can join sessions, pick a number, and compete to win! Features authentication, session management, and a live leaderboard.

---

## Demo

👉 [Live Demo](https://game-lobby-system-black.vercel.app/)

---

## Repositories

- **Frontend:** [https://github.com/mohdnas0001/game-lobby-system](https://github.com/mohdnas0001/game-lobby-system)
- **Backend:** [https://github.com/mohdnas0001/game-lobby-backend](https://github.com/mohdnas0001/game-lobby-backend)

---

## Features

- **User Authentication:** Register/login with a username (JWT-based).
- **Game Lobby:** Join active sessions (20s rounds), pick a number (1-10).
- **Game Mechanics:** Random winning number at session end; winners are updated.
- **Leaderboard:** Top 10 players sorted by wins, with badges/icons for top 3.
- **Modern UI:** Built with React, TypeScript, Tailwind CSS, and Lucide Icons.
- **API:** Node.js, Express, MongoDB, JWT.
- **Polling:** TanStack Query for efficient data fetching and caching.
- **Hosting:** Frontend on Vercel, backend on Render.

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- MongoDB (local or Atlas)
- GitHub account

---

### Backend

1. **Clone & Install**
    ```sh
    git clone https://github.com/mohdnas0001/game-lobby-backend
    cd game-lobby-backend
    yarn install
    ```

2. **Configure Environment**
    - Create a `.env` file:
      ```
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/game-lobby
      JWT_SECRET=your_jwt_secret_here
      ```
    - Replace `MONGODB_URI` with your MongoDB connection string.

3. **Run Locally**
    ```sh
    yarn start
    ```
    Backend runs at [http://localhost:5000](http://localhost:5000)

---

### Frontend

1. **Clone & Install**
    ```sh
    git clone https://github.com/mohdnas0001/game-lobby-system
    cd game-lobby-system
    yarn install
    ```

2. **Configure Environment**
    - Create a `.env` file:
      ```
      VITE_API_URL=https://game-lobby-backend-9d4k.onrender.com/api
      ```
    - Replace with your backend URL if self-hosted.

3. **Run Locally**
    ```sh
    yarn dev
    ```
    Frontend runs at [http://localhost:3000](http://localhost:3000)

---

## Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com/) 
- **Backend:** Deploy to [Render](https://render.com/) (set `PORT`, `MONGODB_URI`, `JWT_SECRET`).

---

## Approach

- **Authentication:** JWT tokens stored in localStorage, sent with each API request.
- **Game Sessions:** Managed in MongoDB; only one active session at a time. Sessions auto-rotate every 20 seconds.
- **Frontend:** Uses TanStack Query for polling and caching, React for UI, and Tailwind for styling.
- **Leaderboard:** Top 10 players fetched from backend, sorted by wins.
- **Real-Time:** Polling is used for session and leaderboard updates.
- **Error Handling:** User-friendly toasts for errors and session events.

---

## Future Improvements

- Add real-time updates with Socket.IO.
- Pagination for leaderboard.
- E2E and unit tests.
- Enhanced UI/UX and animations.

---

