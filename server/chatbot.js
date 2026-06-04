const fetch = require('node-fetch');

const destinations = require('./destinations');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

console.log("STARTUP MODEL =", GEMINI_MODEL);

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// ================= PROMPT =================
function buildSystemPrompt() {
    const destList = destinations.map(d =>
        `• ${d.name} (${d.state}): ${d.description} — ₹${d.cost}, Adventure Level: ${d.adventureLevel}/5, Best: ${d.bestSeason}`
    ).join('\n');

    return `
You are Tara, a cheerful and enthusiastic female travel guide for WanderWise. You are a passionate woman who loves exploring India and sharing travel experiences. You speak in Hinglish (mixing Hindi and English) and use colloquial, friendly language with a distinctly female perspective.

PERSONALITY & GENDER:
- You are a woman (lady/mahila) who speaks from a female perspective
- Use female pronouns: "main ek mahila hoon", "meri taraf se", "mere hisaab se"
- Include expressions showing female perspective: "as a travel lady", "ek lady traveler ke taur par", "mujhe ek woman ke nate feel hua"
- Encourage and inspire other women travelers with female-friendly tips
- Use warm, sisterly tone: "beta", "dost", "mere liye"
- Phrases like "Bilkul!", "Zaroor!", "Bahut mast!", "Haan haan", "Arey!", "Kya baat hai!"
- Always end recommendations with "Bilkul mast jagah hai, zaroor jaana!" or similar
- Be enthusiastic and excited about travel
- Use emojis and casual language
- Make jokes and be warm

RULES:
- Always be polite, helpful and enthusiastic
- Maintain female perspective in every response
- Speak naturally in Hinglish
- Keep responses concise but useful
- Recommend only REAL destinations in India
- When recommending a destination, explain WHY it matches the user's requirement
- When the user asks for an itinerary, provide a day-wise plan
- When the user provides a budget, consider it in your recommendation
- When the user mentions duration, use that duration in your itinerary
- If the query is unrelated to travel, politely redirect to travel topics
- Never invent hotels, attractions, prices, or facts
- End travel recommendations with a positive travel-oriented closing

OFF-TOPIC QUERIES:
If question is unrelated to travel (e.g., capital of India, math, science):
Say: "Arre, main toh sirf travel ki baatein karti hoon! Mujhe toh sirf India ke destinations ke baare mein pata hai. Kahan jaana hai tumhe?"

IN-CONTEXT QUERIES:
- Mountains: Recommend Gulmarg, Manali, Auli, Spiti Valley
- Beaches: Recommend Goa, Lakshadweep, Andaman, Kanyakumari
- Heritage: Recommend Jaipur, Varanasi, Agra, Jodhpur
- Adventure: Recommend Rishikesh, Manali, Ladakh, Spiti Valley
- Monsoon: Recommend Goa, Munnar, Coorg, Mawlynnong
- Budget: Recommend Varanasi, Kanyakumari, Pushkar, Hampi
- Honeymoon: Recommend Goa, Manali, Lakshadweep, Andaman
- Greetings (hi, hello, namaste): Respond warmly and ask what they want to explore

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

        // ✅ DESTINATION SPECIFIC LOOKUP
            const destination = destinations.find(d =>
                msg.includes(d.name.toLowerCase())
            );

            if (destination) {
                return `📍 ${destination.name}, ${destination.state}

            ${destination.description}

            💰 Budget: ₹${destination.cost}
            🌤️ Best Season: ${destination.bestSeason}
            🎯 Adventure Level: ${destination.adventureLevel}/5

            Bilkul mast jagah hai, zaroor jaana! 🌍`;
            }

        // ✅ GREETINGS
        if (msg.match(/^(hi|hello|namaste|hey|hola|kya hal hai|kaisa hai)/)) {
            return "Namaste beta! Main Tara hoon, ek lady travel guide! 🙏 Meri taraf se tum ko India ke sabse mast destinations dikhana pasand hai. Kahan jaana hai? Mountains, beaches, heritage, ya adventure? Bilkul mast jagah hai, zaroor jaana!";
        }

        // ✅ MOUNTAINS
        if (msg.includes("mountain") || msg.includes("parvat") || msg.includes("hilltop"))
            return "Arre! Mountains toh bahut mast hain! Mere hisaab se Gulmarg (snow se dhaka rehta hai ❄️), Manali (paragliding karega?), Auli (skiing), ya Spiti Valley (bohot ajeeb landscape). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ BEACHES
        if (msg.includes("beach") || msg.includes("kinara") || msg.includes("samudra"))
            return "Beach ka matlab toh WanderWise! 🏖️ Ek lady traveler ke taur par main kehti hoon—Goa (party + beach combo), Andaman (snorkeling karega?), Lakshadweep (island vibes), ya Kanyakumari (teeno samudr milte hain). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ MONSOON
        if (msg.includes("monsoon") || msg.includes("varsha") || msg.includes("barish"))
            return "Monsoon mein kya scene hai! 🌧️ Mujhe ek woman traveler ke nate bohot pasand hai—Goa, Munnar, Coorg, ya Mawlynnong (greenery ki over-dose!). Rain mein travel karte feel karo alag! Bilkul mast jagah hai, zaroor jaana!";

        // ✅ ADVENTURE
        if (msg.includes("adventure") || msg.includes("thrill") || msg.includes("adrenaline") || msg.includes("sports") || msg.includes("trekking"))
            return "Adrenaline seekers ko bohot pasand aayega! 🚀 Manali (paragliding), Rishikesh (rafting), Spiti Valley (high-altitude trek), Ladakh (biking). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ HERITAGE
        if (msg.includes("heritage") || msg.includes("history") || msg.includes("monument") || msg.includes("culture"))
            return "History ke fans ko toh WanderWise se love ho jayega! 🏰 Jaipur (Hawa Mahal, City Palace), Varanasi (ghat + spirituality), Agra (Taj Mahal), Jodhpur (Blue City). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ HONEYMOON
        if (msg.includes("honeymoon") || msg.includes("romantic") || msg.includes("couple") || msg.includes("pyaar"))
            return "Oho! Honeymoon toh bahut special hona chahiye! 💕 Ek mahila ke taur par main dekh chuki hoon—Goa (sunset + beach romance), Manali (mountains + peace), Lakshadweep (island paradise), Andaman (backwater ka scenes). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ BUDGET
        if (msg.includes("budget") || msg.includes("cheap") || msg.includes("sasta") || msg.includes("affordable"))
            return "Budget mein travel karna hai? No problem! 💰 Varanasi (bohot sasta aur spiritual), Kanyakumari (₹15k mein travel karo), Pushkar (camel safari low cost), Hampi (backpacker heaven). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ HIDDEN GEMS
        if (msg.includes("hidden") || msg.includes("offbeat") || msg.includes("unique") || msg.includes("secret"))
            return "Offbeat destinations ka kya scene hai! 🌟 Mere experience mein—Spiti Valley (otherworldly landscape), Hampi (temples + boulders), Mawlynnong (greenest village), Chettinad (colonial charm). Bilkul mast jagah hai, zaroor jaana!";

        // ✅ DURATION/DAYS
        if (msg.includes("day") || msg.includes("week") || msg.includes("duration") || msg.includes("kitne din"))
            return "Kitne din ka plan hai? 📅 2 din mein Agra, 3 din mein Manali, 4 din mein Goa, ya 5 din mein Spiti Valley. Kaunsa destination pasand hai? Bilkul mast jagah hai, zaroor jaana!";

        // ✅ COST/PRICE
        if (msg.includes("cost") || msg.includes("price") || msg.includes("rupees") || msg.includes("kitna kharcha"))
            return "Budget kya ho raha hai? 💸 10k se 50k tak sab kuch available hai! Varanasi (₹10-15k), Manali (₹25-35k), Goa (₹20-30k), Lakshadweep (₹45k+). Kaunsa range pasand? Bilkul mast jagah hai, zaroor jaana!";

        // ✅ OFF-TOPIC (FALLBACK)
        return "Arre, main toh sirf travel ki baatein karti hoon! 😅 Mujhe toh destinations, trips, adventure, beaches—sirf ye sab pata hai. Kahan jaana hai tumhe? Ask me about mountains, beaches, honeymoon, budget trips, ya adventure! 🌍";
    }
}

console.log("🚀 CHATBOT BUILD MARKER v2.5 FLASH LITE");

module.exports = {
    streamChatResponse
};

