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
            // Always render current state when opening (fixes persistence after close)
            renderChatMessages();
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            console.log("✅ Chat closed");
            panel.style.display = 'none';
            // Clear chat history from UI when user closes the panel
            state.chatHistory = [];
            renderChatMessages(); // Re-render empty state
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
            <button class="card-action-btn" onclick="planTravel('${dest.name}')">📋 Plan Travel</button>
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


// ✅ HELPER: Handle travel planning click
function planTravel(destName) {
    console.log("🧳 Planning travel to:", destName);
    
    const dest = state.destinations.find(d => d.name === destName);
    if (!dest) return;
    
    // ✅ Show modal with destination details
    showDestinationModal(dest.id);
}

// ✅ HELPER: Show destination details modal
function showDestinationModal(destId) {
    const dest = state.destinations.find(d => d.id === destId);
    if (!dest) return;

    const modal = document.getElementById('tripCardModal');
    const content = document.getElementById('tripCardContent');

    if (!modal || !content) return;

    // Generate modal HTML with interactive actions
    const modalHTML = `
        <div class="modal-details">
            <img src="${dest.imageUrl}" alt="${dest.name}" class="modal-image">
            
            <div class="modal-info">
                <div class="modal-header-content">
                    <h2 class="modal-title">${dest.name}</h2>
                    ${dest.isTopPick ? '<span class="modal-badge">✨ Top Pick</span>' : ''}
                </div>
                
                <p class="modal-location">📍 ${dest.state}</p>
                
                <div class="modal-description">
                    <p>${dest.description}</p>
                </div>

                <div class="modal-stats">
                    <div class="stat">
                        <span class="stat-label">Budget</span>
                        <span class="stat-value">₹${dest.cost.toLocaleString()}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Best Season</span>
                        <span class="stat-value">${dest.bestSeason}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Ideal Duration</span>
                        <span class="stat-value">${dest.idealDays} days</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Adventure Level</span>
                        <span class="stat-value">${dest.adventureLevel}/5</span>
                    </div>
                </div>

                <div class="modal-attractions">
                    <h3>✨ Top Attractions</h3>
                    <ul class="attractions-list">
                        ${dest.topThings.map(thing => `<li>${thing}</li>`).join('')}
                    </ul>
                </div>

                <div class="modal-actions-primary">
                    <button class="btn-book-trip" onclick="bookTrip('${dest.name}', ${dest.id})">🎫 Book Trip</button>
                    <button class="btn-view-hotels" onclick="viewHotels(${dest.id})">🏨 View Hotels</button>
                    <button class="btn-view-itinerary" onclick="viewItinerary(${dest.id})">📅 View Itinerary</button>
                </div>

                <div class="modal-actions-secondary">
                    <button class="btn-chat-tara">💬 Chat with Tara</button>
                </div>
            </div>
        </div>
    `;

    content.innerHTML = modalHTML;
    modal.classList.remove('hidden');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Attach close button handler
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = closeDestinationModal;
    }

    // Close on background/overlay click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeDestinationModal();
        }
    };

    // Close on Escape key
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeDestinationModal();
        }
    };
    modal._escapeHandler = handleEscapeKey;
    document.addEventListener('keydown', handleEscapeKey);

    // Chat button handler
    const chatBtn = modal.querySelector('.btn-chat-tara');
    if (chatBtn) {
        chatBtn.onclick = () => {
            closeDestinationModal();

            document.getElementById('chatToggle').click();

    setTimeout(() => {
        document.getElementById('chatInput').value =
            `Tell me about ${dest.name}`;

        sendMessage();
    }, 300);
};
}

// ✅ HELPER: Close destination modal
function closeDestinationModal() {
    const modal = document.getElementById('tripCardModal');
    if (modal) {
        modal.classList.add('hidden');
        // Restore background scrolling
        document.body.style.overflow = 'auto';

        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
            modal._escapeHandler = null;
        }
    }
}

// ✅ HELPER: Book trip action
function bookTrip(destName, destId) {
    console.log(`🎫 Booking trip to ${destName}`);
    alert(`🎫 Booking feature coming soon!\n\nDestination: ${destName}\n\nYou'll be redirected to the booking page.`);
}

// ✅ HELPER: View hotels action
function viewHotels(destId) {
    const dest = state.destinations.find(d => d.id === destId);
    console.log(`🏨 Viewing hotels for ${dest.name}`);
    alert(`🏨 Hotel listings for ${dest.name}\n\nThis feature will show available hotels with pricing and ratings.`);
}

// ✅ HELPER: View itinerary action
function viewItinerary(destId) {
    const dest = state.destinations.find(d => d.id === destId);
    console.log(`📅 Viewing itinerary for ${dest.name}`);
    alert(`📅 Suggested itinerary for ${dest.name}\n\nDay-by-day travel plans with activities and recommendations.`);
}

// ================= CHAT CORE =================
// Render chat history to UI and scroll
function renderChatMessages() {
    const chatBox = document.getElementById('chatMessages');
    if (!chatBox) return;

    // If no chat history, show initial welcome message
    if (state.chatHistory.length === 0) {
        chatBox.innerHTML = `
            <div class="chat-message tara">
                <div class="chat-bubble">
                    Namaste! Main Tara hoon, tumhare travel guide. Kahan jaana hai? 😊
                </div>
            </div>
            <div class="quick-replies" id="quickReplies">
                <button class="quick-reply-chip" data-question="Best place for monsoon?">Best place for monsoon?</button>
                <button class="quick-reply-chip" data-question="Budget-friendly trips?">Budget-friendly trips?</button>
                <button class="quick-reply-chip" data-question="Honeymoon destinations?">Honeymoon destinations?</button>
                <button class="quick-reply-chip" data-question="Adventure spots?">Adventure spots?</button>
            </div>
        `;
        // Re-attach quick reply handlers
        setupQuickReplies();
        return;
    }

    // Render full chat history
    chatBox.innerHTML = state.chatHistory.map(item => {
        if (item.role === 'user') {
            return `
                <div class="chat-message user">
                    <div class="chat-bubble">${item.content}</div>
                </div>
            `;
        } else {
            // assistant (Tara)
            const mentioned = extractDestinations(item.content);
            let assistantHTML = `
                <div class="chat-message tara">
                    <div class="chat-bubble">${item.content}</div>`;

            if (mentioned.length > 0) {
                assistantHTML += `
                    <div class="travel-actions">
                        ${mentioned.map(d => createTravelAction(d)).join('')}
                    </div>`;
            }

            assistantHTML += `</div>`;
            return assistantHTML;
        }
    }).join('');

    // allow layout then scroll
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
}

async function sendMessage() {
    console.log("✅ sendMessage triggered");

    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const message = input.value.trim();
    if (!message) return;

    // push user message to state and render
    state.chatHistory.push({ role: 'user', content: message });
    renderChatMessages();

    // clear input and disable while waiting
    input.value = '';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await res.json();
        const reply = data.reply || "Sorry, I didn't understand that.";

        // push assistant reply and render
        state.chatHistory.push({ role: 'assistant', content: reply });
        renderChatMessages();

    } catch (err) {
        console.error("Chat error:", err);
        state.chatHistory.push({ role: 'assistant', content: '⚠️ Error connecting to server' });
        renderChatMessages();
    } finally {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}
