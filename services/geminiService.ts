
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askBankingAssistant = async (question: string, context: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful, professional banking assistant for "Lumina Bank". 
      Current user context: ${context}. 
      Answer this user query concisely and politely: ${question}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting to my knowledge base right now.";
  }
};
