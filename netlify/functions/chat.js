import { GoogleGenAI } from "@google/genai";

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { messages, categoryPrompt } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY environment variable is not set on Netlify." }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-netlify",
        },
      },
    });

    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let systemInstruction = `You are Eco Buddy, an enthusiastic, knowledgeable, and encouraging AI sustainability assistant. Provide practical eco-friendly tips, water-saving advice, energy reduction strategies, recycling guidance, and sustainable transport advice.`;
    if (categoryPrompt) {
      systemInstruction += ` Focus area: ${categoryPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply: response.text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Server Error" }),
    };
  }
};

