import { GoogleGenAI, Type } from '@google/genai';

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
    
    const systemInstruction = `You are a financial assistant with access to a real-time currency exchange tool powered by the Frankfurter API (https://frankfurter.dev/). Whenever a user asks for current exchange rates, trends, or conversions, you must use the get_live_exchange_rate tool to fetch the latest data before responding. Always state the date/time of the retrieved rate. Provide concise, clear, and accurate answers. Current user context: ${context || 'None'}`;
    
    const getLiveExchangeRate = {
      name: "get_live_exchange_rate",
      description: "Fetches the latest currency exchange rates from the Frankfurter API.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          from_currency: {
            type: Type.STRING,
            description: "The 3-letter currency code to convert from (e.g., USD, EUR)."
          },
          to_currency: {
            type: Type.STRING,
            description: "The 3-letter currency code to convert to (e.g., CDF, EUR). If omitted, returns rates against EUR by default."
          }
        },
        required: ["from_currency"]
      }
    };
    
    let currentMessages = [...messages];
    
    let response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: currentMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ functionDeclarations: [getLiveExchangeRate] }]
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'get_live_exchange_rate') {
        const { from_currency, to_currency } = call.args as any;
        
        try {
          const url = to_currency 
            ? `https://api.frankfurter.app/latest?from=${from_currency}&to=${to_currency}`
            : `https://api.frankfurter.app/latest?from=${from_currency}`;
          const apiRes = await fetch(url);
          const data = await apiRes.json();
          
          currentMessages.push(response.candidates?.[0]?.content as any);
          currentMessages.push({
            role: "user",
            parts: [{
              functionResponse: {
                name: call.name,
                response: data
              }
            }]
          } as any);
          
          response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: currentMessages,
            config: {
              systemInstruction,
              temperature: 0.7,
              tools: [{ functionDeclarations: [getLiveExchangeRate] }]
            }
          });
        } catch (e) {
          currentMessages.push(response.candidates?.[0]?.content as any);
          currentMessages.push({
            role: "user",
            parts: [{
              functionResponse: {
                name: call.name,
                response: { error: "Failed to fetch live exchange rate" }
              }
            }]
          } as any);
          
          response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: currentMessages,
            config: {
              systemInstruction,
              temperature: 0.7,
              tools: [{ functionDeclarations: [getLiveExchangeRate] }]
            }
          });
        }
      }
    }

    const replyText = response.text || "I'm sorry, I couldn't generate a response.";
    res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error("Vercel Function Error:", error);
    res.status(500).json({ error: "Sorry, I'm having trouble connecting right now." });
  }
}
