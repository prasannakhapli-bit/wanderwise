const API_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://wanderwise-api-rhia.onrender.com/api';

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

// === CHAT SETUP (✅ FIXED EVENTS HERE) ===
function setupChat() {
    const toggle = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.querySelector('.chat-close');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const quickReplies = document.querySelectorAll('.quick-reply-chip');

    toggle.addEventListener('click', () => {
        state.chatOpen = !state.chatOpen;
        panel.classList.toggle('hidden');
        if (state.chatOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
        state.chatOpen = false;
        panel.classList.add('hidden');
    });

    // ✅ FIXED BUTTON CLICK
    sendBtn.addEventListener('click', sendMessage);

    // ✅ FIXED ENTER KEY
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    quickReplies.forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.question;
            sendMessage();
            document.getElementById('quickReplies').style.display = 'none';
        });
    });
}

// === SEND MESSAGE (✅ FULLY IMPROVED VERSION) ===
async function sendMessage(retryMessage = null) {
    const input = document.getElementById('chatInput');
    const message = retryMessage || input.value.trim();

    if (!message) return;

    if (!retryMessage) {
        input.value = '';
        addChatMessage('user', message);
    }

    const quickReplies = document.getElementById('quickReplies');
    if (quickReplies) quickReplies.style.display = 'none';

    const messagesDiv = document.getElementById('chatMessages');

    // ✅ typing indicator
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

    try {
        const history = state.chatHistory.slice(-24).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        let fullResponse = '';

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 60000);

        let response;

        try {
            response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }

        if (!response.ok) throw new Error('Chat failed');

        // ✅ REMOVE typing
        typingDiv.remove();

        const responseBubble = document.createElement('div');
        responseBubble.className = 'chat-message tara';

        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'chat-bubble';

        // ✅ UX improvement
        bubbleContent.textContent = "Thinking...";

        responseBubble.appendChild(bubbleContent);
        messagesDiv.appendChild(responseBubble);

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
                        }

                        if (json.data && json.data.done) {
                            break;
                        }

                    } catch (e) {}
                }
            }
        }

        state.chatHistory.push({ role: 'user', content: message });
        state.chatHistory.push({ role: 'assistant', content: fullResponse });

    } catch (err) {
        console.error('Chat error:', err);

        // ✅ REMOVE typing on error
        typingDiv.remove();

        addChatMessage('tara',
            '⏳ Server waking up... ek sec ruk, retry kar raha hoon...'
        );

        // ✅ SAFE RETRY (does NOT break input)
        setTimeout(() => {
            sendMessage(message);
        }, 4000);
    }
}

// === UTILITIES ===
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

function setupFooter() {}
