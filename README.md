# Word Rush — Multiplayer Web Game

A small real-time multiplayer word/reaction game built with React, Vite, Node.js, Express and Socket.IO.

## Local run

1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm run dev` for development, or `npm run build && npm start` for production.
4. Open the shown URL. For multiple players, use multiple browser windows/devices.

## Deployment

This app needs a Node-compatible host because Socket.IO requires a persistent server connection. Deploy the repository to a Node hosting service, set the build command to `npm install && npm run build`, and start command to `npm start`. The host's public URL can then be shared.

## Game rules

- 2–8 players per room.
- Four-character room codes.
- 10 rounds.
- First correct: 100 base points; second: 75; third: 50; later: 25.
- Small speed bonus based on response time.
- Host can replay the same room after results.
