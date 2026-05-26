# WanderWise — Server Rules

## Tech Stack
- **Node.js + Express** (no TypeScript, no additional heavy libraries).
- **Port**: 3000 (or use `process.env.PORT`).
- **CORS**: Enabled for `http://localhost:8080` and `http://localhost:5173` (dev).
- **Environment**: `.env` file loaded via `dotenv.config()`, never hardcoded.

## File Organization
```
server/
├── server.js           ← Entry point, Express app, route handlers
├── destinations.js     ← 16 destinations array
├── chatbot.js          ← Gemini integration, streaming logic
├── .env                ← Secrets (gitignored)
├── .env.example        ← Template for secrets
└── package.json
```

## Response Shape
All endpoints return:
```json
{
  "success": true,
  "message": "Human-readable status",
  "data": { /* endpoint-specific payload */ }
}
```

On error:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Endpoints

### GET `/api/health`
- **Response**: `{ "success": true, "message": "Tara is ready to explore!", "data": null }`

### GET `/api/destinations`
- **Query params**: none required (frontend filters client-side).
- **Response**: `{ "success": true, "message": "All destinations", "data": [ {...}, {...} ] }`
- Returns all 16 destinations as an array.

### POST `/api/chat`
- **Body**:
  ```json
  {
    "message": "User's question",
    "history": [
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ]
  }
  ```
- **Streaming**: Responds with `Content-Type: application/x-ndjson` (newline-delimited JSON).
- Each line is:
  ```json
  { "success": true, "message": "Streaming...", "data": { "chunk": "word " } }
  ```
- Final line:
  ```json
  { "success": true, "message": "Stream complete.", "data": { "done": true } }
  ```

## Secrets
- `.env` must contain:
  - `GEMINI_API_KEY`: Your Google Gemini API key.
  - `PORT`: Server port (default 3000).
- Load **before starting the server**, use `path.join(__dirname, '.env')` to ensure correct path.

## Error Handling
- If Gemini API fails, respond with:
  ```json
  { "success": false, "message": "Tara ke dimaag mein kuch gadbad ho gayi!", "data": null }
  ```
- If history array is malformed, use an empty history and continue.

## Logging
- Log server start: `Server listening on port ${PORT}`.
- Log errors with full stack for debugging.
- Do NOT log API keys or sensitive data.

