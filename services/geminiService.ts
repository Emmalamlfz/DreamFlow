import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid runtime crashes, though app requires key
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateActionPlan = async (goal: string): Promise<string[]> => {
  if (!ai) {
    throw new Error("API Key not found");
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      I have a Bucket List goal: "${goal}".
      Please break this down into 3 to 5 concrete, actionable, small steps that I can add to my daily To-Do list.
      Keep them short and concise (under 10 words each).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Error generating action plan:", error);
    throw error;
  }
};
