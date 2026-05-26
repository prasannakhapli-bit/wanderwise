# WanderWise Setup Guide

Your complete travel discovery website is ready! Here's how to get it running.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Get a Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://ai.google.dev) 
2. Click **"Get API Key"** (free tier available)
3. Copy your API key

### Step 2: Configure the Server (1 minute)

In `server/` folder:

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and paste your API key
# On Windows, you can open it with:
# notepad .env
```

Your `.env` should look like:
```
GEMINI_API_KEY=your_actual_key_here
PORT=3000
```

### Step 3: Install Dependencies

Open terminal in `server/` folder:
```bash
npm install
```

This installs Express, CORS, and dotenv (only 3 dependencies, very lightweight).

### Step 4: Start the Backend

In the `server/` folder:
```bash
npm start
```

You should see:
```
Server listening on port 3000
```

### Step 5: Start the Frontend (new terminal window)

From the root `wanderwise/` folder:
```bash
node website-server.js
```

You should see:
```
Static website server listening on http://localhost:8080
```

### Step 6: Open the Website

Open your browser to:
```
http://localhost:8080
```

**You're live! 🎉**

---

## 🧪 Test Tara's Chat

In a new terminal, go to `server/` folder:
```bash
npm run test-tara
```

You'll see Tara respond to a mountain trip request, word-by-word. This tests the entire Gemini integration.

---

## 📋 What You Have

✅ **16 handpicked Indian destinations** (4 per category)  
✅ **Dreamy magazine-style website** with animations  
✅ **Tara AI guide** who speaks Hinglish  
✅ **Streaming chat** (word-by-word responses)  
✅ **Fully responsive** design (mobile, tablet, desktop)  
✅ **No build tools** — pure HTML/CSS/JS  
✅ **Small backend** — just Express, nothing heavy  

---

## 🎮 Try These First

1. **Click "START EXPLORING"** on the welcome screen → See paper plane animations
2. **Filter destinations** → Switch between Mountains, Beaches, Heritage, Hidden Gems
3. **Open chat** → Click the 💬 button (bottom-right)
4. **Try these questions**:
   - "Best place for monsoon?"
   - "Budget-friendly adventure spots?"
   - "Honeymoon destinations in mountains?"
   - "Kuch hidden gems batao!"

---

## 🔧 Troubleshooting

### "Arre yaar, kuch toh gadbad hui!" error
**Solution**: 
- Check that backend is running (`npm start` in `server/`)
- Verify Gemini API key in `.env` is correct
- Check browser console (F12 → Console tab)

### Chat not connecting
**Solution**:
- Both servers running? (Backend on 3000, Frontend on 8080)
- Check `.env` has valid `GEMINI_API_KEY`
- Restart both servers

### "Not found" when opening localhost:8080
**Solution**:
- Make sure you ran `node website-server.js` from the root folder
- Check the terminal shows the server started

### npm: command not found
**Solution**:
- Install [Node.js](https://nodejs.org) (v14 or higher)
- Restart your terminal after installing

---

## 📁 File Layout

```
wanderwise/
├── website/              ← Frontend (open in browser)
│   ├── index.html       ← Main page
│   ├── style.css        ← All styling (CSS variables, animations)
│   └── script.js        ← Chat logic, animations, API calls
├── server/              ← Backend
│   ├── server.js        ← Express app, 3 endpoints
│   ├── chatbot.js       ← Gemini streaming
│   ├── destinations.js  ← 16 destinations data
│   ├── test-tara.js     ← CLI test script
│   ├── package.json     ← Dependencies
│   └── .env             ← Your secrets (gitignored)
├── website-server.js    ← Serves the frontend
└── README.md            ← Full documentation
```

---

## 🎨 Customization Ideas

### Change Tara's Personality
Edit `server/chatbot.js` → `buildSystemPrompt()` function. Modify the system prompt to make her more formal, funnier, etc.

### Add/Remove Destinations
Edit `server/destinations.js` → The array of 16 destinations. Add or remove entries, restart server.

### Change Colors
Edit `website/style.css` → Look for `:root` section with CSS variables. Change any of these:
- `--sky-blue` (headers, main color)
- `--sunset-orange` (buttons, accents)
- `--sand-beige` (chat bubbles, light backgrounds)
- `--ocean-teal` (secondary color)

### Modify Welcome Message
Edit `website/index.html` → Change the tagline "Duniya Dekhni Hai? Chalo Shuru Karte Hain" to anything you want.

---

## 🚀 Going Live (Future)

When you're ready to deploy:
1. Get a hosting service (Vercel, Netlify, Heroku, AWS, etc.)
2. Set up your Gemini API key as an environment variable on the host
3. Update the `API_URL` in `website/script.js` to point to your hosted backend
4. Deploy both frontend and backend

---

## 📚 Understanding the Architecture

**Frontend** → Loads in browser, calls backend API → Displays results, streams chat

**Backend** → Receives requests → Calls Google Gemini → Streams responses back as newline-delimited JSON

**Chat Flow**:
1. User types a message in the chat panel
2. JavaScript sends it to `/api/chat` endpoint
3. Backend gets the message + history
4. Backend calls Google Gemini with a system prompt that describes Tara
5. Gemini streams its response word-by-word
6. Frontend displays each word as it arrives (creates illusion of Tara "thinking")

---

## 💡 Pro Tips

- **Mute/unmute audio** with the 🔊 button (top-right) — toggle persists
- **Quick-reply chips** appear in chat for inspiration
- **Scroll behavior**: Pages auto-scroll smoothly when you click navigation links
- **Responsive design**: Try opening on mobile to see the layout adapt
- **No dependencies headache**: Only 3 npm packages (Express, CORS, dotenv)

---

## ❓ Questions?

Check `README.md` for full documentation.
Check `chatbot-rules.md` to understand Tara's personality.
Check `server-rules.md` for API details.
Check `website-rules.md` for frontend specifics.

---

**Ready? Start the servers and explore! 🗺️✨**
