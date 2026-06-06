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
        // Fetching the secure header we will inject via Render
        const configResponse = await fetch(window.location.href, { method: 'HEAD' });
        const secureKey = configResponse.headers.get('X-Groq-Key');

        if (!secureKey) {
            loadingDiv.textContent = 'שגיאה: מפתח ה-API לא הוגדר בצורה מאובטחת בשרת.';
            return;
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secureKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Your name is Elian AI. You are a smart AI assistant. The primary language of your interface is Hebrew, but you can talk in any language the user speaks to you."
                    },
                    ...conversationHistory
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            loadingDiv.textContent = reply;
            conversationHistory.push({ role: 'assistant', content: reply });
        } else {
            loadingDiv.textContent = 'שגיאה בקבלת תשובה מה-AI.';
        }
    } catch (error) {
        loadingDiv.textContent = 'שגיאה בתקשורת הישירה אל Groq.';
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
