const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const destinations = require('./destinations');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildSystemPrompt() {
    const destList = destinations.map(d => 
        `• ${d.name} (${d.state}): ${d.description} — ₹${d.cost}, Adventure Level: ${d.adventureLevel}/5, Best: ${d.bestSeason}`
    ).join('\n');

    return `You are Tara, a warm and friendly AI travel guide for WanderWise. You speak natural Hinglish (Roman script).

Your personality:
- Enthusiastic and well-travelled
- Speak in 2-5 sentences, short and natural
- No markdown, no bullet lists, no emojis unless the user used one first
- You know only the WanderWise destinations provided below

IMPORTANT RULES:
1. If recommending a destination, ALWAYS end with exactly: "Bilkul mast jagah hai, zaroor jaana!"

2. If asked about something clearly unrelated to travel (coding, recipes, math, philosophy), respond with EXACTLY: "Arre, main toh sirf travel ki baatein karti hoon!"

IMPORTANT: Booking intent like "book this", "plan this", "mujhe yahaan jaana hai", "book my trip" is ALWAYS related to travel. NEVER treat booking as off-topic.


3. If the user expresses booking intent, respond warmly and encourage the decision.
Always refer to the last recommended destination by name in the response (e.g., "Manali mast choice hai").
Example: "Arre wah, Manali mast choice hai! Tumhe bahut maza aayega."


4. Travel-adjacent questions (cost, season, food, transport, days, weather) are NEVER off-topic — relate them to the 16 destinations

5. Keep a conversational tone; refer to previous messages in the history to follow up naturally

The 16 WanderWise destinations are:
${destList}

Answer the user's question as Tara, staying true to this character and knowledge base.`;
}

async function streamChatResponse(userMessage, history) {
    const systemPrompt = buildSystemPrompt();
    
    // Build messages for Gemini - prepend system message to first user message
    const messages = [
    {
        role: "user",
        parts: [{ text: systemPrompt }]
    },
    ...history.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    })),
    {
        role: "user",
        parts: [{ text: userMessage }]
    }
];

   
    const requestBody = {
        contents: messages,
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 150
        }
    };

    try {
        // For development: bypass SSL verification if needed
        

        const response = await fetch(
            `${GEMINI_URL}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                agent: agent
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Gemini request error:', error);
        throw error;
    }
}

async function* parseSSEStream(reader) {
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Normalize CRLF to LF
        buffer = buffer.replace(/\r\n/g, '\n');
        
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';

        for (const frame of frames) {
            if (frame.startsWith('data: ')) {
                const data = frame.slice(6);
                if (data.trim()) {
                    try {
                        const json = JSON.parse(data);
                        yield json;
                    } catch (e) {
                        // Skip malformed JSON frames
                    }
                }
            }
        }
    }

    // Process remaining buffer
    if (buffer.trim()) {
        if (buffer.startsWith('data: ')) {
            const data = buffer.slice(6);
            try {
                const json = JSON.parse(data);
                yield json;
            } catch (e) {
                // Skip malformed JSON
            }
        }
    }
}

async function extractTextFromGeminiResponse(geminiResponse) {
    let fullText = '';

    try {
        for await (const chunk of parseSSEStream(geminiResponse.body.getReader())) {
            if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content) {
                const content = chunk.candidates[0].content;
                if (content.parts && content.parts[0] && content.parts[0].text) {
                    fullText += content.parts[0].text;
                }
            }
        }
    } catch (error) {
        console.error('Error parsing stream:', error);
        throw error;
    }

    return fullText;
}

async function streamChatResponseWordByWord(userMessage, history, responseCallback) {
    const response = await streamChatResponse(userMessage, history);
    let fullText = '';

    try {
        for await (const chunk of parseSSEStream(response.body.getReader())) {
            if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content) {
                const content = chunk.candidates[0].content;
                if (content.parts && content.parts[0] && content.parts[0].text) {
                    const text = content.parts[0].text;
                    
                    // Split by spaces and yield word by word
                    const words = text.split(/(\s+)/);
                    for (const word of words) {
                        if (word) {
                            fullText += word;
                            responseCallback({ chunk: word });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error streaming response:', error);
        throw error;
    }

    return fullText;
}

module.exports = {
    streamChatResponse,
    streamChatResponseWordByWord,
    extractTextFromGeminiResponse,
    parseSSEStream
};
