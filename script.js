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
    setupQuickReplies();
    setupChatToggle();
    document.getElementById('chatPanel').style.display = 'none';
});

function setupChatToggle() {
    const toggleBtn = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.querySelector('.chat-close');

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            console.log("✅ Chat opened");
            panel.style.display = 'block';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            console.log("✅ Chat closed");
            panel.style.display = 'none';
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

    container.innerHTML = filtered.map(dest => `
        <div class="destination-card">
            ${dest.imageUrl ? `<img class="card-image" src="${dest.imageUrl}" alt="${dest.name} view">` : ''}
            <div class="card-header">
                <h3 class="card-title">${dest.name}</h3>
                ${dest.isTopPick ? '<span class="card-badge">✨ Top Pick</span>' : ''}
                <p class="card-state">${dest.state}</p>
            </div>
            <p class="card-description">${dest.description}</p>
            <div class="card-cost">Cost: ₹${dest.cost.toLocaleString()} per person</div>
            <div class="card-details"><strong>Top Things to Do:</strong>
                <ul class="card-details-list">
                    ${dest.topThings.map(thing => `<li>${thing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

// ================= CHAT SETUP =================
function setupChat() {
    const input = document.getElementById('chatInput');
    let sendBtn = document.getElementById('chatSend');

    if (!input || !sendBtn) {
        console.error("❌ Chat elements not found");
        return;
    }

    console.log("✅ Chat setup initialized");

    // ✅ CLONE button to remove stale handlers
    const newBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newBtn, sendBtn);
    sendBtn = newBtn;

    // ✅ Attach fresh click handler
    sendBtn.addEventListener('click', () => {
        console.log("✅ Send button clicked");
        sendMessage();
    });

    // ✅ Attach Enter key handler
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log("✅ Enter pressed");
            sendMessage();
        }
    });
}

function setupQuickReplies() {
    document.querySelectorAll('.quick-reply-chip').forEach(btn => {
        btn.onclick = () => {
            const text = btn.getAttribute('data-question');
            console.log("✅ Quick reply:", text);

            document.getElementById('chatInput').value = text;
            sendMessage();
        };
    });
}

// ================= TRAVEL PLANNING HELPERS =================

// ✅ HELPER: Detect destinations mentioned in text
function extractDestinations(text) {
    const mentioned = [];
    if (!state.destinations.length) return mentioned;
    
    const lowerText = text.toLowerCase();
    state.destinations.forEach(dest => {
        if (lowerText.includes(dest.name.toLowerCase())) {
            mentioned.push(dest);
        }
    });
    return mentioned;
}

// ✅ HELPER: Create travel planning action
function createTravelAction(destination) {
    return `
        <button class="travel-action-btn" onclick="planTravel('${destination.name}')">
            ✈️ Plan Travel to ${destination.name}
        </button>
    `;
}

// ✅ HELPER: Handle travel planning click
function planTravel(destName) {
    console.log("🧳 Planning travel to:", destName);
    
    const dest = state.destinations.find(d => d.name === destName);
    if (!dest) return;
    
    // ✅ Scroll to destinations section
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
    
    // ✅ Filter to show this destination
    state.currentFilter = dest.category.toLowerCase();
    renderDestinations();
    
    // ✅ Highlight the destination card
    setTimeout(() => {
        const cards = document.querySelectorAll('.destination-card');
        cards.forEach(card => {
            if (card.textContent.includes(destName)) {
                card.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.8)';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }, 300);
}

// ================= CHAT CORE =================
async function sendMessage() {
    console.log("✅ sendMessage triggered");

    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = "";

    const chatBox = document.getElementById("chatMessages");

    // ✅ Show user message
    chatBox.innerHTML += `
        <div class="chat-message user">
            <div class="chat-bubble">${message}</div>
        </div>
    `;

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        const reply = data.reply || "Sorry, I didn't understand that.";
        
        // ✅ Detect destinations mentioned in reply
        const mentionedDests = extractDestinations(reply);

        // ✅ Show Tara reply
        let replyHTML = `
            <div class="chat-message tara">
                <div class="chat-bubble">${reply}</div>
        `;
        
        // ✅ Add travel planning buttons if destinations mentioned
        if (mentionedDests.length > 0) {
            replyHTML += `
                <div class="travel-actions">
                    ${mentionedDests.map(d => createTravelAction(d)).join('')}
                </div>
            `;
        }
        
        replyHTML += `</div>`;
        
        chatBox.innerHTML += replyHTML;

        // ✅ Auto scroll
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error("Chat error:", err);

        chatBox.innerHTML += `
            <div class="chat-message tara">
                <div class="chat-bubble">⚠️ Error connecting to server</div>
            </div>
        `;
    }
}
