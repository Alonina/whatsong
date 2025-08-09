# What's That Song?

This repository previously contained only the compiled output and dependencies of the game. The actual application source is missing. The following document summarizes the intended features and design of the app based on the available assets.

## Game Overview
- **Real-Time Multiplayer** – players join using a code and guess song titles and artists in real-time.
- **Spotify Integration** – music snippets are pulled from Spotify playlists using OAuth authentication.
- **Game Modes** – individual or team-based play with an admin controlling the session.
- **Scoring** – 15 points for the correct title and 5 points for the correct artist. First to 200 points wins.
- **Bonuses** – quick guess bonus and occasional bonus songs worth extra points.
- **Leaderboards** – in-game scoreboard and an all-time leaderboard.

## Admin & Player Flow
1. Admin authenticates with Spotify and selects a playlist.
2. Players join the lobby using the game code.
3. Admin starts the round and everyone hears the first 5 seconds of each song.
4. Players submit guesses; scores update live.
5. After reaching 200 points, the round ends and players can replay or exit.

## Visual Design
- Dark theme using black background with a Spotify green gradient.
- Rounded corners on all interactive elements.
- Lottie animations for transitions and celebrations.
- Blend of real photography (people playing) with animated icons for a modern look.

## Tech Stack
- **Frontend:** React.js (built with Vite)
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Real-Time:** Socket.io
- **Spotify Auth:** OAuth

## Missing Source
Only compiled `dist` files exist in this repository. To extend or modify the app, the original React and Node.js source code is required. Without it, implementing additional features will be difficult.

