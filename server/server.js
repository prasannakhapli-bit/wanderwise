require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const destinations = require('./destinations');
const { streamChatResponseWordByWord } = require('./chatbot');

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE ===
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'file://'],
    credentials: true
}));
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
                success: false,
                message: 'Message is required',
                data: null
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Tara ke dimaag mein kuch gadbad ho gayi!',
                data: null
            });
        }

        // Set streaming response headers
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Validate history
        const cleanHistory = Array.isArray(history)
            ? history.filter(msg => msg.role && msg.content)
            : [];

        // Stream the response
        await streamChatResponseWordByWord(
            message,
            cleanHistory,
            (chunk) => {
                const line = JSON.stringify({
                    success: true,
                    message: 'Streaming...',
                    data: { chunk: chunk.chunk }
                }) + '\n';
                res.write(line);
            }
        );

        // Send completion message
        res.write(JSON.stringify({
            success: true,
            message: 'Stream complete.',
            data: { done: true }
        }) + '\n');

        res.end();
    } catch (error) {
        console.error('Chat error:', error);

        // If headers already sent, just end response
        if (res.headersSent) {
            res.end();
        } else {
            res.status(500).json({
                success: false,
                message: 'Tara ke dimaag mein kuch gadbad ho gayi!',
                data: null
            });
        }
    }
});

// === ERROR HANDLING ===
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Server error',
        data: null
    });
});

// === STARTUP ===
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
        console.warn('WARNING: GEMINI_API_KEY not set in .env');
    }
});
