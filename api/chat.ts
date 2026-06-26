import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, context } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid payload layout" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: messages,
      config: {
        systemInstruction: `You are a helpful and expert financial assistant specializing in global currencies, exchange rates, and personal finance tips. Provide concise, clear, and accurate answers. Current user context: ${context || 'None'}`,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I'm sorry, I couldn't generate a response.";
    res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error("Vercel Function Error:", error);
    res.status(500).json({ error: "Sorry, I'm having trouble connecting right now." });
  }
}
