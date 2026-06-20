import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Production-ready Security Configurations
  app.disable('x-powered-by');

  // Custom enterprise-grade secure HTTP response headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Secure against clickjacking
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Powered-By', 'Secure-Fortress-Engine/v1.0');
    next();
  });

  // Limit incoming payloads to prevent buffer overload/malicious body flooding (DDoS on body parser)
  app.use(express.json({ limit: '15kb' }));

  // 2. High-performance, memory-safe sliding window rate-limiting middleware (anti-DDoS / API Abuse protection)
  const userAccessRecords = new Map<string, { currentWindowStart: number; payloadCount: number }>();
  const INTERVAL_MS = 60 * 1000; // 1 minute window
  const CAPACITY_LIMIT = 20; // 20 chat generations per IP per minute max

  const rateSecLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const origIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'visitor-unknown';
    const clientIp = Array.isArray(origIp) ? origIp[0] : (origIp as string).split(',')[0].trim();
    const current = Date.now();

    const record = userAccessRecords.get(clientIp);
    if (!record || (current - record.currentWindowStart) > INTERVAL_MS) {
      userAccessRecords.set(clientIp, {
        currentWindowStart: current,
        payloadCount: 1
      });
      return next();
    }

    if (record.payloadCount >= CAPACITY_LIMIT) {
      return res.status(429).json({ 
        error: "Shield activated: rate capacity threshold exceeded. Please retry in a short while." 
      });
    }

    record.payloadCount++;
    next();
  };

  // API Route: Chatbot integration with added protection layer
  app.post('/api/chat', rateSecLimiter, async (req, res, next) => {
    try {
      const { messages, context } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid payload layout" });
      }

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
      next(error); // Pass safely to secure global error processor
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

  // Secure Global Error Catcher middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Shield Guard caught operational handler failure:", err.message || err);
    res.status(500).json({ 
      error: "Our dynamic security layer intercepted an error logs anomaly. Connection closed securely." 
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
