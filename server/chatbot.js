const fetch = require('node-fetch');   // ✅ REQUIRED FIX

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

async function streamChatResponse(userMessage, history) {
    try {
        const systemPrompt = buildSystemPrompt();

        const messages = [
            {
                role: "model",
                parts: [{ text: systemPrompt }]
            },
            ...(Array.isArray(history) ? history : []).map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            })),
            {
                role: "user",
                parts: [{ text: userMessage.toLowerCase().trim() }]
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
            console.error("Gemini API error:", await response.text());
            throw new Error('Gemini API error');
        }

        const data = await response.json();

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm not sure about that, but I can help you plan a trip! Try asking about beaches, mountains, or cities."
        );

    } catch (error) {
        console.error("Chatbot Error:", error);

        const msg = userMessage.toLowerCase();

        if (msg.includes("mountain")) {
            return "Manali and Gulmarg are great mountain destinations.";
        }

        if (msg.includes("beach")) {
            return "Goa and Andaman are excellent beach destinations.";
        }

        return "⚠️ Temporary issue — meanwhile, you can explore mountains like Manali, beaches like Goa, or cities like Jaipur.";
    }
}

module.exports = {
    streamChatResponse
};
``