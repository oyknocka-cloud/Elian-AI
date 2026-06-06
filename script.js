const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
let conversationHistory = [];

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    conversationHistory.push({ role: 'user', content: text });

    const loadingDiv = appendMessage('מהרהר...', 'ai');

    try {
        // Calls your secure backend server instead of exposing your key
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory })
        });

        const data = await response.json();
        loadingDiv.textContent = data.reply;
        conversationHistory.push({ role: 'assistant', content: data.reply });
    } catch (error) {
        loadingDiv.textContent = 'שגיאה: לא מצליח להתחבר לשרת.';
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

function changeThemeMode() {
    const mode = document.getElementById('theme-select').value;
    const customSection = document.getElementById('custom-colors');
    const root = document.documentElement;

    if (mode === 'light') {
        customSection.style.display = 'none';
        root.style.setProperty('--bg-color', '#f4f6f9');
        root.style.setProperty('--panel-color', '#ffffff');
        root.style.setProperty('--text-color', '#333333');
    } else if (mode === 'dark') {
        customSection.style.display = 'none';
        root.style.setProperty('--bg-color', '#121212');
        root.style.setProperty('--panel-color', '#1e1e1e');
        root.style.setProperty('--text-color', '#ffffff');
    } else if (mode === 'custom') {
        customSection.style.display = 'flex';
        applyCustomColors();
    }
}

function applyCustomColors() {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', document.getElementById('accent-picker').value);
    
    if (document.getElementById('theme-select').value === 'custom') {
        root.style.setProperty('--bg-color', document.getElementById('bg-picker').value);
        root.style.setProperty('--panel-color', document.getElementById('panel-picker').value);
        root.style.setProperty('--text-color', document.getElementById('text-picker').value);
    }
}
