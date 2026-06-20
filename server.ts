import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  app.use(express.json());

  // API Route: Chatbot integration
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: messages,
        config: {
          systemInstruction: `You are a helpful and expert financial assistant specializing in global currencies, exchange rates, and personal finance tips. Provide concise, clear, and accurate answers. Current user context: ${context || 'None'}`,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I'm sorry, I couldn't generate a response.";
      
      res.json({ reply: replyText });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
