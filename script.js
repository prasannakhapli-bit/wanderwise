const API_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://wanderwise-api-rhia.onrender.com/api';

// === STATE ===
let state = {
    destinations: [],
    chatHistory: [],
    currentFilter: 'all',
    chatOpen: false
};

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    setupWelcome();
    setupDestinations();
    setupChat();
    setupFilterButtons();

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
        const section = document.getElementById('destinations');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
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
        container.innerHTML = `<p>No destinations found</p>`;
        return;
    }

    container.innerHTML = filtered.map(dest => `
        <div class="destination-card">
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
        </div>
    `).join('');
}

// ================= CHAT =================
function setupChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!input || !sendBtn) return;

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ✅ STABLE CHAT (NON-STREAMING)
async function sendMessage(retryMessage = null) {
    const input = document.getElementById('chatInput');
    const message = retryMessage || input.value.trim();

    if (!message) return;

    input.value = '';
    addChatMessage('user', message);

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: state.chatHistory })
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        addChatMessage('tara', data.reply);

        // ✅ Maintain conversation history
        state.chatHistory.push({ role: 'user', content: message });
        state.chatHistory.push({ role: 'assistant', content: data.reply });

    } catch (err) {
        console.error(err);
        addChatMessage('tara', "⏳ Just a moment while I reconnect...");
    }
}

// ================= UI =================
function addChatMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    document.getElementById('chatMessages').appendChild(div);
    return div;
}

function setupFooter() {}
``