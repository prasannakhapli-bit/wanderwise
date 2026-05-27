const fetch = require('node-fetch');

const destinations = require('./destinations');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// ================= PROMPT =================
function buildSystemPrompt() {
    const destList = destinations.map(d =>
        `• ${d.name} (${d.state}): ${d.description} — ₹${d.cost}, Adventure Level: ${d.adventureLevel}/5, Best: ${d.bestSeason}`
    ).join('\n');

    return `
You are Tara, a polite, friendly and professional female travel assistant for WanderWise.

RULES:
- Always be polite and helpful
- Keep answers short (2–4 sentences)
- Recommend REAL travel destinations from India
- NEVER say "I don't know" — always suggest something helpful

OFF-TOPIC:
If question is unrelated to travel, say:
"I specialize in travel planning. Ask me about destinations, trips, or ideas!"

Destinations:
${destList}
`;
}

// ================= CHAT =================
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

        console.log("👉 Sending to Gemini:", userMessage);

        const response = await fetch(
            `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: messages,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200
                    }
                })
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Gemini API error:", errText);
            throw new Error('Gemini API failed');
        }

        const data = await response.json();

        console.log("✅ Gemini raw response:", JSON.stringify(data, null, 2));

        // ✅ IMPROVED RESPONSE EXTRACTION
        const text =
            data?.candidates?.[0]?.content?.parts?.map(p => p.text).join(' ') ||
            null;

        if (!text || text.trim().length < 3) {
            throw new Error("Empty AI response");
        }

        return text;

    } catch (error) {
        console.error("⚠️ Chatbot fallback triggered:", error);

        const msg = userMessage.toLowerCase();

        // ✅ SMART FALLBACK COVERAGE
        if (msg.includes("mountain"))
            return "Manali and Gulmarg are great mountain destinations.";

        if (msg.includes("beach"))
            return "Goa and Andaman are excellent beach destinations.";

        if (msg.includes("monsoon"))
            return "Munnar, Coorg, and Goa are fantastic monsoon destinations.";

        if (msg.includes("adventure"))
            return "Rishikesh, Manali, and Ladakh are top adventure spots.";

        if (msg.includes("heritage"))
            return "Jaipur, Udaipur, and Varanasi are rich in heritage.";

        if (msg.includes("hidden"))
            return "Spiti Valley, Tawang, and Ziro Valley are beautiful hidden gems.";

        return "I can help you explore mountains, beaches, heritage cities, or adventure destinations. What interests you?";
    }
}

module.exports = {
    streamChatResponse
};
``