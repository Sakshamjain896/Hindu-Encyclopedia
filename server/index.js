import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// New MongoDB-based Routes
app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/users', userRoutes);

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure users file exists
try {
  await fs.access(USERS_FILE);
} catch {
  await fs.writeFile(USERS_FILE, '[]');
}

// User Routes
app.post('/api/purchase-tokens', async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).json({ error: 'Missing userId or amount' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tokens = (user.tokens || 0) + parseInt(amount);
    await user.save();

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        tokens: user.tokens,
        premium: user.premium
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/unlock-premium', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.premium) return res.status(400).json({ error: 'User is already premium' });

    const cost = 500;
    if ((user.tokens || 0) < cost) return res.status(402).json({ error: 'Insufficient Celestial Shards' });

    user.tokens -= cost;
    user.premium = true;
    await user.save();

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        tokens: user.tokens,
        premium: user.premium
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});






const API_KEY = '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';
const AI_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function callGenerative(prompt, responseMimeType) {
  const payload = {
    model: 'meta/llama-3.1-70b-instruct',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    top_p: 0.7,
    max_tokens: 1024,
    stream: false
  };

  if (responseMimeType === 'application/json') {
    // Only some NVIDIA endpoints support 'type: json_object', 
    // but strict JSON instructions in prompt usually work with Llama 3.
    // We will attempt to force it via prompt engineering since we can't guarantee 'response_format' support across all models.
    if (!permissionToUseJsonMode(payload.model)) {
       // Just rely on prompt 
    } else {
       payload.response_format = { type: 'json_object' };
    }
  }

  const response = await fetch(AI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI responded with ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  return rawText ?? '';
}

function permissionToUseJsonMode(model) {
   // Simplified check
   return model.includes('llama-3'); 
}

app.post('/api/ai', async (req, res) => {
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const { prompt, fallback, responseType = 'text' } = req.body;
  const responseMimeType = responseType === 'json' ? 'application/json' : undefined;

  if (!API_KEY) {
    console.warn('GENAI_API_KEY missing, returning fallback');
    return res.json({ payload: fallback });
  }

  try {
    const text = await callGenerative(prompt, responseMimeType);
    if (responseType === 'json') {
      try {
        const parsed = JSON.parse(text);
        return res.json({ payload: parsed });
      } catch (jsonError) {
        console.warn('Unable to parse JSON response, returning fallback', jsonError);
        return res.json({ payload: fallback });
      }
    }

    return res.json({ payload: text || fallback });
  } catch (error) {
    console.warn('AI request failed, falling back', error);
    return res.json({ payload: fallback });
  }
});


const IMG_AI_URL = 'https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl-base-1.0';

async function callImageGenerative(prompt) {
  const payload = {
    text_prompts: [{ text: prompt, weight: 1 }],
    cfg_scale: 7,
    clip_guidance_preset: "NONE",
    sampler: "K_DPM_2_ANCESTRAL",
    steps: 30,
    seed: 0
  };

  const response = await fetch(IMG_AI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI Image responded with ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  // NVIDIA NIM SDXL response format: { artifacts: [{ base64: "..." }] }
  const base64Img = data?.artifacts?.[0]?.base64;
  return base64Img ? `data:image/png;base64,${base64Img}` : '';

}

app.post('/api/generate-image', async (req, res) => {
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const { prompt } = req.body;

  if (!API_KEY) {
     return res.status(500).json({ error: 'API Key missing' });
  }

  try {
    const imageUrl = await callImageGenerative(prompt);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation failed:', error);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Hindu Encyclopedia server listening on port ${PORT}`);
});
