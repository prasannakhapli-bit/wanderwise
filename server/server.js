require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const destinations = require('./destinations');
const { streamChatResponse } = require('./chatbot');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= BASIC ROUTES =================
app.get('/', (req, res) => {
    res.send('✅ Wanderwise API is running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'wanderwise-api' });
});

// ================= MIDDLEWARE =================
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));

// ================= API =================

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tara is ready to explore!'
  });
});

// ✅ Get destinations
app.get('/api/destinations', (req, res) => {
  try {
    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({
      success: false,
      data: null
    });
  }
});

// ✅ FIXED CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    let { message, history } = req.body;

    // ✅ Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        reply: 'Please enter a valid message.'
      });
    }

    // ✅ CRITICAL FIX: ensure history is always array
    if (!Array.isArray(history)) {
      history = [];
    }

    // ✅ LIMIT history (prevents memory/API issues)
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // ✅ Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return res.status(500).json({
        reply: 'Server configuration issue. Please try again later.'
      });
    }

    console.log("📩 Incoming message:", message);

    // ✅ Call AI
    const reply = await streamChatResponse(message, history);

    // ✅ Safety check
    if (!reply || typeof reply !== 'string') {
      throw new Error("Invalid AI response");
    }

    res.json({ reply });

  } catch (err) {
    console.error("❌ Chat error:", err);

    // ✅ SAFE FALLBACK (NEVER BREAK UI)
    let fallback = "⚠️ I'm having a temporary issue. Try asking about travel destinations!";

    const msg = (req.body?.message || "").toLowerCase();

    if (msg.includes("mountain")) {
      fallback = "Manali and Gulmarg are great mountain destinations.";
    } else if (msg.includes("beach")) {
      fallback = "Goa and Andaman are excellent beach options.";
    }

    // ✅ IMPORTANT: always return 200
    res.json({ reply: fallback });
  }
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ WARNING: GEMINI_API_KEY not set');
  }
});