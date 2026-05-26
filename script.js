async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    input.value = '';
    addChatMessage('user', message);

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

    try {
        // Prepare history
        const history = state.chatHistory.slice(-24).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        let fullResponse = '';

        // ✅ TIMEOUT + CONTROLLER
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 60000); // 60 sec

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

        // ✅ Remove typing indicator
        typingDiv.remove();

        const responseBubble = document.createElement('div');
        responseBubble.className = 'chat-message tara';

        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'chat-bubble';

        // ✅ SHOW LOADING TEXT (UX FIX)
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

                    } catch (e) {
                        // ignore parse errors
                    }
                }
            }
        }

        // ✅ Save history
        state.chatHistory.push({ role: 'user', content: message });
        state.chatHistory.push({ role: 'assistant', content: fullResponse });

        // ✅ Booking detection
        if (isBookingIntent(message, fullResponse)) {
            showBookingCard(fullResponse);
        }

    } catch (err) {
        console.error('Chat error:', err);

        // ✅ Remove typing indicator (IMPORTANT FIX)
        typingDiv.remove();

        addChatMessage('tara',
            '⏳ Server thoda slow hai... ek sec ruk, dobara try karo.'
        );

        // ✅ OPTIONAL AUTO RETRY (safe retry)
        setTimeout(() => {
            sendMessage(message);
        }, 4000);
    }
}