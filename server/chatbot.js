const destinations = require('./destinations');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildSystemPrompt() {
    const destList = destinations.map(d =>
        `• ${d.name} (${d.state}): ${d.description} — ₹${d.cost}, Adventure Level: ${d.adventureLevel}/5, Best: ${d.bestSeason}`
    ).join('\n');

    return `
You are Tara, a polite, friendly and professional female travel assistant for WanderWise.

IMPORTANT:
- Always be polite and professional
- Do not use slang or rude tone
- Keep responses short (2–4 sentences)

OFF-TOPIC:
If question is unrelated to travel, reply:
"I specialize in travel planning and destinations. Let me help you find a great place to explore!"

Destinations:
${destList}
`;
}

// ✅ SINGLE CLEAN FUNCTION (NO STREAMING)
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

    const response = await fetch(
        `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: messages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error('Gemini API error');
    }

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
}

module.exports = {
    streamChatResponse
};
