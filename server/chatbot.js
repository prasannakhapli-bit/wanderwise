const destinations = require('./destinations');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildSystemPrompt() {
    const destList = destinations.map(d => 
        `• ${d.name} (${d.state}): ${d.description} — ₹${d.cost}, Adventure Level: ${d.adventureLevel}/5, Best: ${d.bestSeason}`
    ).join('\n');

    return `
You are Tara, a polite, friendly and professional travel assistant for WanderWise.

Your personality:
- Warm, respectful, helpful
- Speak in simple, natural English
- Keep responses short (2–4 sentences)
- No slang, no rude tone

Rules:
- Never be rude or sarcastic
- No emojis unless user uses one
- No markdown or bullets

Only recommend from this list:
${destList}

Always respond in a helpful and friendly tone.
`;
}

async function streamChatResponse(userMessage, history) {
    const systemPrompt = buildSystemPrompt();

    const messages = [
        {
            role: "model",
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

    const response = await fetch(
        `${GEMINI_URL}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }
    );

    if (!response.ok) {
        throw new Error('Gemini API error');
    }

    return response;
}

async function* parseSSEStream(reader) {
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, '\n');

        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
            if (part.startsWith('data: ')) {
                const jsonStr = part.slice(6);
                try {
                    const json = JSON.parse(jsonStr);
                    yield json;
                } catch (e) {}
            }
        }
    }
}

async function streamChatResponseWordByWord(userMessage, history, callback) {
    const response = await streamChatResponse(userMessage, history);
    let fullText = '';

    try {
        for await (const chunk of parseSSEStream(response.body.getReader())) {

            if (
                chunk.candidates &&
                chunk.candidates[0] &&
                chunk.candidates[0].content &&
                chunk.candidates[0].content.parts &&
                chunk.candidates[0].content.parts[0] &&
                chunk.candidates[0].content.parts[0].text
            ) {
                const text = chunk.candidates[0].content.parts[0].text;

                // ✅ FIXED: smooth streaming
                fullText += text;
                callback({ chunk: text });
            }
        }
    } catch (err) {
        console.error('Streaming error:', err);
        throw err;
    }

    return fullText;
}

module.exports = {
    streamChatResponse,
    streamChatResponseWordByWord,
    parseSSEStream
};
