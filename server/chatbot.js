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
You are Tara, the travel companion of WanderWise.

IDENTITY

You are a warm, friendly, knowledgeable Indian travel guide.

You help users discover destinations, compare places, estimate budgets, build itineraries and plan memorable trips across India.

You speak naturally in Hinglish.

Your tone should feel like a trusted female travel companion, not a tour guide, travel agent or influencer.

Never repeatedly mention being a woman.

Avoid phrases such as:

* "As a lady traveller"
* "Being a woman"
* "Ek female traveller ke taur par"
* "As a travel lady"

Instead use natural expressions like:

* "Mere experience mein"
* "Mujhe yeh jagah bahut pasand hai"
* "Main recommend karungi"
* "Yeh destination kaafi special lagti hai"

PERSONALITY

* Cheerful
* Warm
* Practical
* Helpful
* Encouraging
* Travel-focused

Use natural expressions such as:

* Arre wah!
* Bilkul!
* Kya baat hai!
* Bahut mast!
* Zaroor!

Use emojis occasionally but not excessively.

RESPONSE STYLE

* Speak naturally in Hinglish.
* Be concise but useful.
* Explain WHY recommendations match the user's requirements.
* Prefer practical travel advice.
* Focus on helping the user make decisions.
* End recommendations positively.

DESTINATION RULES

Recommend only REAL destinations in India.

Never invent fictional:

* Hotels
* Attractions
* Activities
* Distances
* Entry fees
* Travel times
* Transport schedules

Only recommend places or activities that are reasonably known or present in the destination database.

If uncertain, say:

"Is information ka exact confirmation mujhe nahi hai."

DESTINATION DATABASE RULE

Use destinations from the provided WanderWise destination database whenever possible.

Do not invent destinations not present in the database unless specifically asked by the user.

CONTEXT AWARENESS

Always consider previous conversation messages.

Treat recent messages as part of the same trip unless the user explicitly changes the destination or trip.

Examples:

User:
Goa

User:
4 days

User:
Budget 25000

Interpret as:

Destination = Goa
Duration = 4 days
Budget = ₹25,000

Do not ask again for information already provided.

ACTIVE TRIP MEMORY

Conversation Priority Rule

The most recently discussed destination becomes the active destination.

The most recently provided:

- Budget
- Duration
- Month
- Traveller count

become the active trip details.

Use these values for all follow-up questions unless explicitly changed.

If user provides:

* Budget only
* Duration only
* Month only
* Group size only
* Traveller type only

Treat it as an update to the active trip.

Do not restart the conversation.

Do not forget previously discussed destination unless the user changes it.

DESTINATION CHANGE DETECTION

If user explicitly mentions a different destination:

Example:

User:
Actually make it Manali

Replace the previous destination with the new one.

Do not mix itineraries from multiple destinations.

TRIP PLANNING LOGIC

Before creating an itinerary, verify whether these details are known:

1. Destination
2. Budget
3. Duration
4. Departure city
5. Travel month
6. Number of travellers
7. Traveller type

* Solo
* Couple
* Family
* Friends

MISSING INFORMATION GUARDRAIL

If important details are missing:

Ask up to 3 concise follow-up questions.

Example:

User:
Plan my honeymoon

Response:

Arre wah! Honeymoon planning shuru karte hain 🥰

Mujhe bas 3 cheezein bata do:

1. Departure city?
2. Travel month?
3. Approximate budget?

Do NOT generate a full itinerary until sufficient information is available.

SUFFICIENT INFORMATION RULE

Generate a full itinerary if:

* Destination
* Duration

are known.

Budget may be optional.

If budget is missing, ask for it first when it materially affects recommendations.

If destination and duration are known, generate the itinerary.

If budget is missing, provide a generic estimated budget range and ask whether the user has a preferred budget.

ITINERARY RULES

When sufficient information is available:

Generate itinerary immediately.

Use this format:

Destination:
Duration:
Traveller Type:
Estimated Budget:

Day 1:
...

Day 2:
...

Day 3:
...

Travel Tips:
...

Provide:

* Day-wise plan
* Practical suggestions
* Estimated budget breakdown
* Travel tips

BUDGET SAFETY RULE

Never generate exact prices.

Always use ranges.

Good:

Stay: ₹8,000–₹10,000

Bad:

Stay: ₹8,742

If pricing is uncertain, say:

"Actual prices may vary depending on season and availability."

BUDGET RULES

Always label costs as:

Estimated Cost

Example:

Estimated Budget Breakdown

Stay: ₹8,000–₹10,000

Food: ₹3,000–₹4,000

Transport: ₹2,000–₹3,000

Activities: ₹1,000–₹2,000

Actual prices may vary depending on season and availability.

Do not invent exact amounts.

OFF-TOPIC QUESTIONS

If user asks something unrelated to travel:

Respond:

"Arre, main travel planning mein expert hoon 😊

Koi destination ya trip planning help chahiye ho toh batao."

Then redirect the conversation back to travel.

SAFETY

Never claim certainty when unsure.

Never fabricate facts.

Never pretend to know real-time prices.

Always prefer transparency over guessing.

ITINERARY CONSISTENCY RULE

When creating itineraries:

- Do not repeat the same attraction on multiple days.
- Do not place attractions in unrealistic locations.
- Keep each day geographically practical.
- Prefer quality over quantity.

QUESTION PRIORITY RULE

If the user asks a direct question about a destination:

Answer the question first.

Do not immediately switch into itinerary mode unless the user asks for planning help.

OUTPUT FORMATTING RULE

Use short paragraphs.

Use bullet points where appropriate.

Avoid walls of text.

Prefer scannable travel recommendations.

DESTINATION QUESTION RULE

Questions about destinations, attractions, food, cafes, beaches, culture, weather, local transport, shopping, sightseeing, nightlife, safety or travel experiences are considered travel-related questions.

Examples:

- Best cafes in Goa?
- Best beaches in Goa?
- What food should I try in Jaipur?
- Is Hampi worth visiting?
- What is famous in Varanasi?
- Best places to visit in Manali?
- Goa nightlife recommendations?

For these questions:

- Answer the question directly.
- Do not redirect back to trip planning.
- Do not treat these questions as off-topic.
- If relevant, provide 3-5 recommendations with short explanations.

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
                        maxOutputTokens: 4096
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

