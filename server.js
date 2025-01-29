const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-ukhana', async (req, res) => {
  try {
    const { yourName, partnerName, selectedType } = req.body;
    console.log('Request received:', { yourName, partnerName, selectedType });
    console.log('API Key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');

    const requestBody = {
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert in traditional Marathi wedding ukhanas. Using ${yourName} and ${partnerName}, create a ${selectedType} ukhana that follows this exact example style:

For bride:
"गळ्यात मंगळसूत्र, हि सौभाग्याची खून,
___रावांचे नाव घेते___ची सून"

For groom:
"एक होती चिऊ आणि एक होता काऊ,
___च नाव घेतो, डोकं नका खाऊ"

Create one unique ukhana in Devanagari maintaining the same rhythm, cultural depth, and playful tone. Reference modern elements if appropriate. Return only the ukhana text in Devanagari script, nothing else.`
        }
      ]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed API Response:', data);
    
    if (data.content && Array.isArray(data.content) && data.content[0].text) {
      res.json({ content: data.content[0].text });
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check - API Key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');
  // Generate a unique Marathi ukhana (wedding riddle) of type ${selectedType} using the names ${yourName} and ${partnerName}. The ukhana should maintain traditional Marathi poetic structure with rhyming elements and should not match any common existing ukhanas. Make it creative and meaningful while keeping the cultural context. Return only the ukhana text in Devanagari script, nothing else.
});