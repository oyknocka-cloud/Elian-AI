const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); // Serves your index.html and script.js from the root folder

// Initialize Groq with your secure environment variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [
                {
                    role: "system",
                    content: "Your name is Elian AI. You are a smart AI assistant. The primary language of your interface is Hebrew, but you can talk in any language the user speaks to you."
                },
                ...messages
            ]
        });
        
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error communicating with AI backend" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
