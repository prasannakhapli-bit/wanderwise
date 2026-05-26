# WanderWise 🌍

A dreamy, magazine-style travel discovery website with **Tara**, an AI travel guide who speaks warm, friendly Hinglish.

---

## Quick Start

### Prerequisites
- **Node.js** (v14+)
- **Google Gemini API Key** ([Get one free here](https://ai.google.dev))

### Setup

#### 1. Install Dependencies
```bash
cd server
npm install
```

#### 2. Create `.env` File
Copy `.env.example` to `.env` and add your Gemini API key:
```bash
cp .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=your_actual_key_here
PORT=3000
```

#### 3. Start the Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:3000`.

#### 4. Start the Frontend Static Server (in a new terminal)
From the root directory:
```bash
node website-server.js
```

The website will be available at `http://localhost:8080`.

#### 5. Open the Website
Open your browser to **`http://localhost:8080`** and start exploring!

---

## Testing

### Test Tara's Chat
Run this from the `server/` directory:
```bash
npm run test-tara
```

You'll see Tara respond to a test mountain trip query, word-by-word, in the terminal.

---

## API Endpoints

### Health Check
```
GET /api/health
```
Returns: `{ "success": true, "message": "Tara is ready to explore!", "data": null }`

### Get Destinations
```
GET /api/destinations
```
Returns all 16 destinations with details.

### Chat with Tara
```
POST /api/chat
Content-Type: application/json

{
    "message": "Best place for monsoon?",
    "history": [
        { "role": "user", "content": "..." },
        { "role": "assistant", "content": "..." }
    ]
}
```

Response: Newline-delimited JSON, streaming word-by-word.

---

## Project Structure

```
wanderwise/
├── website/                   ← Frontend (HTML, CSS, JS)
│   ├── index.html            ← Main page
│   ├── style.css             ← All styling
│   └── script.js             ← Frontend logic
├── website-server.js         ← Static file server
├── server/                   ← Backend (Express + Gemini)
│   ├── server.js             ← Main API server
│   ├── destinations.js       ← 16 destinations data
│   ├── chatbot.js            ← Gemini streaming logic
│   ├── test-tara.js          ← CLI test script
│   ├── package.json
│   ├── .env.example          ← Template for secrets
│   └── .env                  ← Your secrets (gitignored)
├── website-rules.md          ← Frontend guidelines
├── server-rules.md           ← Backend guidelines
├── chatbot-rules.md          ← Tara's personality rules
├── .gitignore
└── README.md                 ← This file
```

---

## Features

### 🎨 Frontend
- **Dreamy, responsive design** with smooth animations
- **Paper plane animations** on the welcome screen
- **16 destination cards** with filters (Mountains, Beaches, Heritage Cities, Hidden Gems)
- **Compass animation** in the about section
- **Counter animation** (50,000+ happy travellers)
- **Floating chat button** to talk with Tara
- **Ambient ocean audio** (muted by default, toggle at top-right)
- **Footer ticker** with Hinglish messages

### 🤖 Tara (AI Guide)
- Speaks warm, friendly **Hinglish** (Roman script)
- Knows all 16 WanderWise destinations
- Recommends trips based on user preferences
- Answers travel-related questions (cost, seasons, transport, etc.)
- Maintains conversation history for follow-ups
- Streams responses word-by-word for natural reading

### 🗺️ Destinations
**16 carefully curated Indian destinations:**
- **Mountains** (4): Gulmarg, Manali, Auli, Spiti Valley
- **Beaches** (4): Goa, Lakshadweep, Kanyakumari, Andaman
- **Heritage Cities** (4): Jaipur, Varanasi, Agra, Jodhpur
- **Hidden Gems** (4): Hampi, Pushkar, Mawlynnong, Chettinad

Each destination includes adventure level, cost, best season, top things to do, and ideal days.

---

## How to Use

1. **Welcome Screen** → Click *"START EXPLORING"* to see paper plane animations
2. **Scroll to Destinations** → Filter by category and explore cards
3. **Chat with Tara** → Click the chat button (bottom-right) to ask questions
4. **Quick Replies** → Use the suggested questions or type your own
5. **Plan a Trip** → When you're interested in a destination, Tara will show you a trip card with all details

---

## Technology Stack

### Frontend
- **HTML5** + **CSS3** (animations, variables, grid layout)
- **Vanilla JavaScript** (no frameworks)
- Responsive design (mobile-first)

### Backend
- **Node.js** + **Express.js**
- **Google Gemini 2.5 Flash Lite** (AI model)
- **Streaming API** for word-by-word responses

---

## Common Issues

### "Arre yaar, kuch toh gadbad hui!"
- **Gemini API Key missing**: Check your `.env` file and restart the server
- **Backend not running**: Run `npm start` in the `server/` directory
- **CORS error**: Make sure both servers are running on the correct ports

### Chat not connecting
- Check that the API is running on `http://localhost:3000`
- Check browser console (F12) for detailed error messages

### Tara's not responding
- Verify your Gemini API key is valid
- Check server logs for streaming errors
- Test with `npm run test-tara` to isolate the issue

---

## Customization

### Change Tara's Personality
Edit `server/chatbot.js` → `buildSystemPrompt()` function. Modify the system prompt to change her personality, tone, or knowledge base.

### Add More Destinations
1. Add to the array in `server/destinations.js`
2. Restart the server
3. Frontend automatically reflects the new data

### Modify Colors & Styles
All colors are CSS variables in `website/style.css`:
- `--sky-blue`, `--sunset-orange`, `--sand-beige`, `--ocean-teal`, etc.

---

## Notes

- **No build tools needed** — Frontend works as-is, just load `index.html`
- **All secrets in `.env`** — Never commit this file
- **Streaming is key** — Responses appear word-by-word for a natural feel
- **History matters** — Chat maintains context for better follow-ups

---

## License

MIT

---

**Made with chai and curiosity** ☕✨

Tara awaits your first adventure!
