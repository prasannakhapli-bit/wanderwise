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
    setupDestinations();
    setupChat();
    setupFilterButtons();

    const modal = document.getElementById('tripCardModal');
    const closeBtn = document.querySelector('#tripCardModal .close-btn');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
});

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

// ✅ FIXED FILTER BUTTONS
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

// ✅ FINAL FIXED RENDER FUNCTION
function renderDestinations() {
    const container = document.getElementById('destinationsList');
    if (!container) return;

    const categoryMap = {
        "mountains": "mountains",
        "beaches": "beaches",
        "heritage sites": "heritage",
        "hidden gems": "hidden"
    };

    const filterKey = categoryMap[state.currentFilter];

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

// ✅ FIXED MESSAGE FLOW
async function sendMessage(retryMessage = null) {
    const input = document.getElementById('chatInput');
    const message = retryMessage || input.value.trim();

    if (!message) return;

    input.value = '';
    addChatMessage('user', message);

    const messagesDiv = document.getElementById('chatMessages');

    try {
        let response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: state.chatHistory })
        });

        if (!response.ok) throw new Error();

        let fullText = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const botMsg = addChatMessage('tara', '');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            try {
                const json = JSON.parse(chunk);
                if (json.data && json.data.chunk) {
                    fullText += json.data.chunk;
                    botMsg.innerHTML = `<div class="chat-bubble">${fullText}</div>`;
                }
            } catch {}
        }

        state.chatHistory.push({ role: 'user', content: message });
        state.chatHistory.push({ role: 'assistant', content: fullText });

    } catch (err) {
        console.error(err);

        addChatMessage('tara', "⏳ Just a moment while I reconnect...");

        if (!retryMessage) {
            setTimeout(() => sendMessage(message), 6000);
        }
    }
}

// ================= UI UTILS =================

function addChatMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;

    document.getElementById('chatMessages').appendChild(div);
    return div;
}

function setupFooter() {}
