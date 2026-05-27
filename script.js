// ✅ FIXED API URL
const API_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://wanderwise-api-rhia.onrender.com';

// === STATE ===
let state = {
    destinations: [],
    chatHistory: [],
    currentFilter: 'all'
};

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ App Loaded");

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
        console.log("Fetching destinations...");
        const res = await fetch(`${API_URL}/destinations`);

        if (!res.ok) throw new Error("Destinations API failed");

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

// ================= CHAT UI =================
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
            chatPanel.style.display = 'none';
            state.chatHistory = [];
            resetChatUI();
        });
    }
}

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
    document.querySelectorAll('.quick-reply-chip').forEach(chip => {
        chip.onclick = () => {
            const question = chip.getAttribute('data-question');
            if (question) sendMessage(question);
        };
    });
}

// ================= CHAT CORE =================
async function sendMessage(forcedMessage = null) {
    const input = document.getElementById('chatInput');

    let message = forcedMessage || (input ? input.value.trim() : "");
    if (!message) return;

    const cleanMessage = message.toLowerCase().trim();
    if (input) input.value = "";

    addChatMessage('user', message);

    try {
        console.log("Calling API:", `${API_URL}/chat`);

        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: cleanMessage,
                history: state.chatHistory || []
            })
        });

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        if (!data || !data.reply) throw new Error("Invalid response");

        addChatMessage('tara', data.reply);

        state.chatHistory.push({ role: 'user', content: cleanMessage });
        state.chatHistory.push({ role: 'assistant', content: data.reply });

    } catch (err) {
        console.error("Chat error:", err);

        addChatMessage('tara', "Try asking about beaches, mountains, or travel ideas!");
    }
}

// ================= CHAT UI =================
function addChatMessage(role, text) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text || ''}</div>`;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ================= MODAL =================
function openTravelModal(query) {
    const modal = document.getElementById('tripCardModal');
    const content = document.getElementById('tripCardContent');

    content.innerHTML = `
        <h2>Travel Plan</h2>
        <p>Planning for: ${query || ''}</p>
    `;

    modal.classList.remove('hidden');
}