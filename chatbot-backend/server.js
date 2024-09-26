const express = require('express');
const axios = require('axios');
const cors = require('cors');


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'Message is required' });
    }

    try {
        const apiKey = 'API_KEY'; // Ensure this is set in your .env file
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{ text: message }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("API Response:", response.data); // Log the full response for debugging
        
        // Check if the response structure contains candidates and parts
        if (response.data && response.data.candidates && response.data.candidates[0].content && response.data.candidates[0].content.parts) {
            const botReply = response.data.candidates[0].content.parts[0].text; // Adjusted to match the response structure
            res.json({ reply: botReply });
        } else {
            res.status(500).json({ error: 'Unexpected API response structure' });
        }

    } catch (error) {
        console.error('Error communicating with API:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
