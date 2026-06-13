# Hindu Mythology Encyclopedia (React)

This workspace hosts a modern React + Node + Python reimagining of the original Hindu mythology encyclopedia experience. It preserves every interactive feature (light/dark gods/asuras switch, AI-powered comparisons, customizable quiz, festival calendar, mantra playback, comparison panel, and the immersive three.js atmosphere) while introducing a simple Node proxy for the Generative Language API and a Python helper script for regenerating the codex data.

## Workspace Structure

- `frontend/` – Vite-powered React (TypeScript) app with `canvas-confetti`, `three`, `callAi`, and the full UI logic.
- `server/` – Express API that proxies AI requests (with optional `GENAI_API_KEY`) and can serve the built front-end in production.
- `python/generate_codex.py` – Recreates `data/codex.json` from a canonical dictionary so you can refresh the shared dataset when needed.
- `data/codex.json` – Shared source of gods, asuras, and festivals used by both the front-end and data script.

## Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   cd ../frontend
   npm install
   ```
2. **Optional Python data refresh**
   ```bash
   cd ../python
   python generate_codex.py
   ```
   This rewrites `../data/codex.json` so the dataset stays synchronized with the script.
3. **Run the server (port 4000 by default)**
   ```bash
   cd ../server
   npm start
   ```
   Provide `GENAI_API_KEY` in your environment to unlock live AI comparisons/expansions. Without it the server falls back to static text/JSON.
4. **Run the React app (port 5173)**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The Vite dev server proxies `/api` to the Node server so AI features continue working locally.

Alternatively, from the repository root you can run `npm start` to launch the React dev server (`npm --prefix frontend run dev`) and `npm run server` to start the Express proxy (`npm --prefix server start`), removing the need to `cd` into subdirectories.

## Production Build

Build the front-end with `npm run build` inside `frontend/`, then run the server in production mode (`NODE_ENV=production npm start`). The Node server will serve the static assets from `frontend/dist` automatically.

## Notes

- The React app imports `../../data/codex.json`, so the front-end and Python script share the same authoritative data snapshot.
- The three.js `ThreeBackground` component runs behind the scenes to deliver the stormy/heavenly motion.
- The Node proxy simply forwards prompts to `https://generativelanguage.googleapis.com/...` when `GENAI_API_KEY` is defined; otherwise it replies with the fallback payload sent by the client.
- The Python generator leans on Unicode-friendly output so Mantras remain in Devanagari.
