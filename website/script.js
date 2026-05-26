const API_URL = 'http://localhost:3000/api';

// === STATE ===
let state = {
    destinations: [],
    chatHistory: [],
    currentFilter: 'all',
    chatOpen: false,
    audioEnabled: localStorage.getItem('audioEnabled') !== 'false'
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    setupAudio();
    setupWelcome();
    setupDestinations();
    setupAbout();
    setupChat();
    setupFooter();
});

// === AUDIO TOGGLE ===
function setupAudio() {
    const audio = document.getElementById('ambientAudio');
    const toggle = document.getElementById('audioToggle');

    updateAudioUI();

    toggle.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        localStorage.setItem('audioEnabled', state.audioEnabled);
        
        if (state.audioEnabled) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
        
        updateAudioUI();
    });
}

function updateAudioUI() {
    const toggle = document.getElementById('audioToggle');
    toggle.textContent = state.audioEnabled ? '🔊' : '🔇';
}

// === WELCOME SCREEN ===
function setupWelcome() {
    const startBtn = document.getElementById('startBtn');
    const canvas = document.getElementById('planeCanvas');
    
    startBtn.addEventListener('click', () => {
        playWhooshSound();
        startPlaneAnimation(canvas);
        
        setTimeout(() => {
            document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });
}

function playWhooshSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function startPlaneAnimation(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    const planes = [];
    for (let i = 0; i < 8; i++) {
        planes.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 8,
            vy: -Math.random() * 5 - 2,
            opacity: Math.random() * 0.6 + 0.4
        });
    }
    
    const startTime = Date.now();
    const duration = 3000;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        planes.forEach(plane => {
            plane.x += plane.vx;
            plane.y += plane.vy;
            
            ctx.save();
            ctx.globalAlpha = plane.opacity * (1 - progress);
            ctx.font = '2rem Arial';
            ctx.fillText('✈', plane.x, plane.y);
            ctx.restore();
        });
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.pointerEvents = 'none';
        }
    }
    
    animate();
}

// === DESTINATIONS ===
async function setupDestinations() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const data = await res.json();
        
        if (!data.success) throw new Error(data.message);
        
        state.destinations = data.data;
        renderDestinations();
        setupFilterButtons();
    } catch (err) {
        console.error('Failed to load destinations:', err);
        showError('Arre yaar, kuch toh gadbad hui! Thoda ruko aur dobara try karo.');
    }
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.currentFilter = btn.dataset.category;
            renderDestinations();
        });
    });
}

function renderDestinations() {
    const container = document.getElementById('destinationsList');
    const filtered = state.currentFilter === 'all'
        ? state.destinations
        : state.destinations.filter(d => d.category === state.currentFilter);
    
    container.innerHTML = filtered.map(dest => `
        <div class="destination-card">
            <div class="card-header">
                <h3 class="card-title">${dest.name}</h3>
                ${dest.isTopPick ? '<span class="card-badge">✨ Top Pick</span>' : ''}
                <p class="card-state">${dest.state}</p>
            </div>
            
            <p class="card-description">${dest.description}</p>
            
            <div class="card-meta">
                <div class="card-meta-item">
                    <span class="card-meta-label">Adventure</span>
                    <div class="card-stars">
                        ${Array(dest.adventureLevel).fill('⭐').join('')}
                    </div>
                </div>
                <div class="card-meta-item">
                    <span class="card-meta-label">Cost/Person</span>
                    <span class="card-meta-value">₹${dest.cost.toLocaleString()}</span>
                </div>
                <div class="card-meta-item">
                    <span class="card-meta-label">Best Season</span>
                    <span class="card-meta-value">${dest.bestSeason}</span>
                </div>
            </div>
            
            <div class="card-cost">
                Ideal Days: ${dest.idealDays} days
            </div>
            
            <div class="card-details">
                <strong>Top Things to Do:</strong>
                <ul class="card-details-list">
                    ${dest.topThings.map(thing => `<li>${thing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

// === ABOUT SECTION ===
function setupAbout() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = document.getElementById('counterText');
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(document.querySelector('.counter-section'));
}

function animateCounter(element) {
    const target = 50000;
    const duration = 2000;
    const start = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * progress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// === CHAT ===
function setupChat() {
    const toggle = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.querySelector('.chat-close');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const quickReplies = document.querySelectorAll('.quick-reply-chip');
    
    toggle.addEventListener('click', () => {
        state.chatOpen = !state.chatOpen;
        if (state.chatOpen) {
            panel.classList.remove('hidden');
            input.focus();
        } else {
            panel.classList.add('hidden');
        }
    });
    
    closeBtn.addEventListener('click', () => {
        state.chatOpen = false;
        panel.classList.add('hidden');
    });
    
    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    quickReplies.forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.question;
            sendMessage();
            // Remove quick replies after first interaction
            document.getElementById('quickReplies').style.display = 'none';
        });
    });
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    input.value = '';
    addChatMessage('user', message);
    
    try {
        // Remove quick replies
        const quickReplies = document.getElementById('quickReplies');
        if (quickReplies) quickReplies.style.display = 'none';
        
        // Show typing indicator
        const messagesDiv = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message tara';
        typingDiv.innerHTML = `
            <div class="chat-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesDiv.appendChild(typingDiv);
        scrollChatToBottom();
        
        // Prepare history (last 12 turns)
        const history = state.chatHistory.slice(-24).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        // Stream response
        let fullResponse = '';
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history })
        });
        
        if (!response.ok) throw new Error('Chat failed');
        
        // Remove typing indicator
        typingDiv.remove();
        const responseBubble = document.createElement('div');
        responseBubble.className = 'chat-message tara';
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'chat-bubble';
        responseBubble.appendChild(bubbleContent);
        messagesDiv.appendChild(responseBubble);
        
        // Stream and display word by word
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();
            
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const json = JSON.parse(line);
                        if (json.data && json.data.chunk) {
                            fullResponse += json.data.chunk;
                            bubbleContent.textContent = fullResponse;
                            scrollChatToBottom();
                        } else if (json.data && json.data.done) {
                            // Stream complete
                            break;
                        }
                    } catch (e) {
                        // Parse error, continue
                    }
                }
            }
        }
        
        // Add to history
        state.chatHistory.push({ role: 'user', content: message });
        state.chatHistory.push({ role: 'assistant', content: fullResponse });
        
        // Check for booking intent
        if (isBookingIntent(message, fullResponse)) {
            showBookingCard(fullResponse);
        }
        
    } catch (err) {
        console.error('Chat error:', err);
        addChatMessage('tara', 'Arre yaar, kuch toh gadbad hui! Thoda ruko aur dobara try karo.');
    }
}

function isBookingIntent(message, response) {
    const bookingKeywords = ['book', 'plan', 'jaana', 'add', 'trip', 'visit', 'explore'];
    const msg = message.toLowerCase() + ' ' + response.toLowerCase();
    return bookingKeywords.some(kw => msg.includes(kw));
}

function addChatMessage(role, content) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = `<div class="chat-bubble">${content}</div>`;
    messagesDiv.appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    requestAnimationFrame(() => {
        messagesDiv.scrollIntoView({ behavior: 'instant', block: 'end' });
    });
}

function showBookingCard(response) {
    const modal = document.getElementById('tripCardModal');
    const destName = extractDestinationFromResponse(response);
    const dest = state.destinations.find(d => d.name.toLowerCase() === destName.toLowerCase());
    
    if (dest) {
        const content = document.getElementById('tripCardContent');
        content.innerHTML = `
            <div class="trip-card">
                <h3>${dest.name}</h3>
                <div class="trip-card-details">
                    <div class="trip-detail-item">
                        <div class="trip-detail-label">Best Season</div>
                        <div class="trip-detail-value">${dest.bestSeason}</div>
                    </div>
                    <div class="trip-detail-item">
                        <div class="trip-detail-label">Cost per Person</div>
                        <div class="trip-detail-value">₹${dest.cost.toLocaleString()}</div>
                    </div>
                    <div class="trip-detail-item">
                        <div class="trip-detail-label">Ideal Duration</div>
                        <div class="trip-detail-value">${dest.idealDays} days</div>
                    </div>
                </div>
                <button class="plan-btn" onclick="planTrip('${dest.name}')">Plan This Trip</button>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
}

function extractDestinationFromResponse(response) {
    const destinations = state.destinations.map(d => d.name);
    for (const dest of destinations) {
        if (response.toLowerCase().includes(dest.toLowerCase())) {
            return dest;
        }
    }
    return '';
}

function planTrip(destName) {
    addChatMessage('tara', 'Added to your wishlist! Mast choice!');
    document.getElementById('tripCardModal').classList.add('hidden');
}

// === FOOTER ===
function setupFooter() {
    // Ticker animation is handled by CSS
}

// === UTILITIES ===
function showError(message) {
    addChatMessage('tara', message);
}
