const API_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://wanderwise-api-rhia.onrender.com/api';

// === STATE ===
let state = {
    destinations: [],
    chatHistory: [],
    currentFilter: 'all'
};

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    setupWelcome();
    setupDestinations();
    setupFilterButtons();
    setupChat();
    setupChatUI();
    setupQuickReplies();

    const modal = document.getElementById('tripCardModal');
    const closeBtn = document.querySelector('.modal-close');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
});

// ================= WELCOME =================
function setupWelcome() {
    const startBtn = document.getElementById('startBtn');
    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ================= DESTINATIONS =================
async function setupDestinations() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const data = await res.json();

        state.destinations = data.data || [];
        renderDestinations();

    } catch (err) {
        console.error("Destinations error:", err);
    }
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            state.currentFilter = btn.dataset.category.toLowerCase();
            renderDestinations();
        });
    });
}

function renderDestinations() {
    const container = document.getElementById('destinationsList');
    if (!container) return;

    const categoryMap = {
        "mountains": "mountains",
        "beaches": "beaches",
        "heritage cities": "heritage",
        "hidden gems": "hidden"
    };

    const filterKey = categoryMap[state.currentFilter] || state.currentFilter;

    const filtered =
        state.currentFilter === 'all'
            ? state.destinations
            : state.destinations.filter(d =>
                (d.category || '').toLowerCase() === filterKey
            );

    if (filtered.length === 0) {
        container.innerHTML = '<p>No destinations found</p>';
        return;
    }

    container.innerHTML = filtered.map(dest =>
        `<div class="destination-card">
            <h3>${dest.name || ''}</h3>
            <p>${dest.description || ''}</p>
        </div>`
    ).join('');
}

// ================= CHAT UI (UPGRADED) =================
function setupChatUI() {
    const toggleBtn = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const closeBtn = document.querySelector('.chat-close');

    if (toggleBtn && chatPanel) {
        toggleBtn.addEventListener('click', () => {
            chatPanel.style.display = 'block';
        });
    }

    if (closeBtn && chatPanel) {
        closeBtn.addEventListener('click', () => {

            // ✅ Hide
            chatPanel.style.display = 'none';

            // ✅ Reset state
            state.chatHistory = [];

            // ✅ Reset UI cleanly
            resetChatUI();
        });
    }
}

// ✅ NEW FUNCTION (important)
function resetChatUI() {
    const container = document.getElementById('chatMessages');

    if (!container) return;

    container.innerHTML = `
        <div class="chat-message tara">
            <div class="chat-bubble">
                Namaste! Main Tara hoon, tumhare travel guide. Kahan jaana hai? 😊
            </div>
        </div>

        <div class="quick-replies">
            <button class="quick-reply-chip" data-question="Best place for monsoon?">Best place for monsoon?</button>
            <button class="quick-reply-chip" data-question="Budget-friendly trips?">Budget-friendly trips?</button>
            <button class="quick-reply-chip" data-question="Honeymoon destinations?">Honeymoon destinations?</button>
            <button class="quick-reply-chip" data-question="Adventure spots?">Adventure spots?</button>
        </div>
    `;

    // ✅ Rebind
    setupQuickReplies();
}

// ================= CHAT =================
function setupChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!input || !sendBtn) return;

    sendBtn.addEventListener('click', () => sendMessage());

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// ================= QUICK REPLIES =================
function setupQuickReplies() {
    const chips = document.querySelectorAll('.quick-reply-chip');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            if (!question) return;

            sendMessage(question);
        });
    });
}

// ================= CHAT CORE =================
async function sendMessage(forcedMessage = null) {
    const input = document.getElementById('chatInput');
    let message = forcedMessage || input.value.trim();

    if (!message) return;

    const cleanMessage = message.toLowerCase().trim();
    input.value = "";

    addChatMessage('user', message);

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: cleanMessage, history: state.chatHistory })
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        addChatMessage('tara', data.reply, cleanMessage);

        state.chatHistory.push({ role: 'user', content: cleanMessage });
        state.chatHistory.push({ role: 'assistant', content: data.reply });

    } catch (err) {
        console.error("API ERROR:", err);

        const fallback = "⚠️ Quick suggestion: " + getFallback(cleanMessage);

        addChatMessage('tara', fallback, cleanMessage);
    }
}

// ================= FALLBACK =================
function getFallback(msg) {
    if (msg.includes("mountain"))
        return "Manali and Gulmarg are beautiful mountain destinations.";

    if (msg.includes("beach"))
        return "Goa and Andaman are perfect beach destinations.";

    if (msg.includes("monsoon"))
        return "Munnar, Coorg, and Goa are amazing during monsoon.";

    if (msg.includes("adventure"))
        return "Rishikesh, Manali, and Ladakh are top adventure spots.";

    if (msg.includes("heritage"))
        return "Jaipur, Udaipur, and Varanasi offer rich heritage experiences.";

    if (msg.includes("hidden"))
        return "Tawang, Ziro Valley, and Spiti are incredible hidden gems.";

    return "Try asking about beaches, mountains, or travel ideas!";
}

// ================= CHAT UI =================
function addChatMessage(role, text, userQuery = "") {
    const container = document.getElementById('chatMessages');

    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text || ''}</div>`;

    container.appendChild(div);

    container.scrollTop = container.scrollHeight;

    if (role === 'tara' && userQuery) {
        const keywords = ["mountain", "beach", "city", "trip", "travel", "destination"];
        const shouldShow = keywords.some(k => userQuery.includes(k));

        if (shouldShow) {
            const oldBtn = container.querySelector('.plan-btn:last-child');
            if (oldBtn) oldBtn.remove();

            const btn = document.createElement('button');
            btn.innerText = "Plan My Travel";
            btn.className = "plan-btn";

            btn.onclick = () => openTravelModal(userQuery);

            container.appendChild(btn);
        }
    }
}

// ================= MODAL =================
function openTravelModal(query) {
    const modal = document.getElementById('tripCardModal');
    const content = document.getElementById('tripCardContent');

    window.scrollTo({ top: 0, behavior: "smooth" });

    content.innerHTML =
        `<h2>Travel Plan</h2>
         <p>Planning for: ${query || ''}</p>`;

    modal.classList.remove('hidden');
}

function setupFooter() {}
``