import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure CORS
app.use(cors());
app.use(express.json());

console.log('Groq API Key length:', process.env.GROQ_API_KEY?.length);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key is not configured' });
    }

    console.log('Calling Groq API...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates blockchain bounty ideas. Generate a concise title and detailed description for a bounty based on the user's input. Format the response as 'Title: [title]\n\nDescription: [description]'"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const completion = await response.json();
    console.log('Groq response received:', completion.choices[0].message.content);
    
    const responseText = completion.choices[0].message.content;
    const [title, ...descriptionParts] = responseText.split('\n\n');
    
    const result = {
      title: title.replace('Title: ', ''),
      description: descriptionParts.join('\n\n').replace('Description: ', '')
    };
    
    console.log('Sending response:', result);
    res.json(result);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
