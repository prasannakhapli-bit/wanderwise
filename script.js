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

// INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ App Loaded");

    setupWelcome();
    setupDestinations();
    setupFilterButtons();
    setupChat();
    setupChatUI(); //✅ ADD THIS

    setupQuickReplies(); // ✅ ADD THIS

    
 // ✅ Hide chat initially
    document.getElementById('chatPanel').style.display = 'none';

});

function setupChatUI() {
    const toggleBtn = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const closeBtn = document.querySelector('.chat-close');

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            chatPanel.style.display = 'block';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            chatPanel.style.display = 'none';
        };
    }
}



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

// ✅ FORCE correct default filter

        state.currentFilter = 'all';
        
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

            state.currentFilter = (btn.dataset.category || '').toLowerCase();
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

    if (!filtered.length) {
        container.innerHTML = "<p>No destinations found</p>";
        return;
    }

    container.innerHTML = filtered.map(dest =>
        `<div class="destination-card">
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
        </div>`
    ).join('');
}

// ================= CHAT =================
function setupChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    console.log("Chat setup:", input, sendBtn);

    if (!input || !sendBtn) {
        console.error("Chat elements not found");
        return;
    }

    // ✅ Send button click
    sendBtn.onclick = () => sendMessage();

    // ✅ Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
}

function setupQuickReplies() {
    document.querySelectorAll('.quick-reply-chip').forEach(btn => {
        btn.onclick = () => {
            const text = btn.getAttribute('data-question');
            document.getElementById('chatInput').value = text;
            sendMessage();
        };
    });
}



// ================= CHAT CORE =================
async function sendMessage() {
    console.log("✅ sendMessage triggered");
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = "";

    try {
        console.log("Calling API:", `${API_URL}/chat`);

        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await res.json();
        console.log("Chat:", data);

    } catch (err) {
        console.error("Chat error:", err);
    }
}