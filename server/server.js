require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');

const destinations = require('./destinations');
const { streamChatResponse } = require('./chatbot');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ Wanderwise API is running');
});

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'wanderwise-api' });
});


// ✅ CLEAN CORS (IMPORTANT)
app.use(cors({
  origin: '*'
}));

// ✅ Middleware
app.use(express.json({ limit: '10kb' }));

// === ENDPOINTS ===

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tara is ready to explore!',
    data: null
  });
});

// Get all destinations
app.get('/api/destinations', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All destinations',
      data: destinations
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destinations',
      data: null
    });
  }
});

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        reply: 'Please enter a valid message.'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        reply: 'Server configuration issue. Please try again later.'
      });
    }

    const reply = await streamChatResponse(message, history);

    res.json({ reply });

  } catch (err) {
    console.error("Chat error:", err);

    res.status(500).json({
      reply: 'Sorry, I am having trouble responding right now.'
    }); 
  }
});



// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    data: null
  });
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY not set in .env');
  }
});