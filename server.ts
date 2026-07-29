import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini AI Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not set or contains a placeholder. Please check your environment configuration.");
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System prompt for Eco Buddy Chatbot
const DEFAULT_SYSTEM_INSTRUCTION = `You are Eco Buddy, an enthusiastic, knowledgeable, and encouraging AI sustainability assistant.
Your goal is to provide practical, high-impact eco-friendly tips, water-saving advice, energy reduction strategies, recycling guidance, and sustainable transport advice.

Key guidelines:
1. Tone: Warm, inspiring, evidence-based, positive, and non-judgmental.
2. Format: Use clean markdown formatting with bullet points, bold key terms, and concise paragraphs.
3. Quantify Impact: Whenever possible, include concrete metrics (e.g., "Saves ~15 gallons of water per day", "Reduces carbon footprint by 2.3 kg CO2e/day").
4. Actionability: Provide step-by-step, realistic steps that anyone can take at home, work, or while commuting.
5. Empathy & Encouragement: Celebrate small eco-wins and build habit momentum. Avoid doom-and-gloom framing; focus on positive collective action.`;

// API Route: Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, categoryPrompt } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const ai = getGeminiClient();

    // Prepare contents array for Gemini API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let systemInstruction = DEFAULT_SYSTEM_INSTRUCTION;
    if (categoryPrompt) {
      systemInstruction += `\nSpecial Context Focus: The user is specifically asking about ${categoryPrompt}. Tailor your advice to emphasize this area with high detail.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, but I couldn't generate a response right now. Please try again!";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: "Failed to generate AI response.",
      details: error.message || String(error),
    });
  }
});

// API Route: Generate Random Fresh Eco Tip
app.post("/api/generate-tip", async (req, res) => {
  try {
    const { topic = "general" } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Provide a single, inspiring, practical daily eco tip regarding ${topic}.
Include:
- A catchy title
- 2-3 sentences explanation
- Estimated impact (e.g., CO2 or water saved)
- Category (Water, Energy, Recycling, Transport, or Zero-Waste)

Format as clean JSON object with keys: title, description, impact, category.`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const tipData = JSON.parse(response.text || "{}");
    return res.json(tipData);
  } catch (error: any) {
    console.error("Error generating tip:", error);
    return res.status(500).json({ error: "Failed to generate tip." });
  }
});

// API Route: Generate Environmental Fact
app.get("/api/generate-fact", async (_req, res) => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Provide one mind-blowing, eye-opening "Did You Know?" environmental fact with real numbers/statistics and a positive call to action. Return standard JSON with keys: fact, context, actionableTip.`,
      config: {
        responseMimeType: "application/json",
      },
    });
    const factData = JSON.parse(response.text || "{}");
    return res.json(factData);
  } catch (error: any) {
    console.error("Error generating fact:", error);
    return res.status(500).json({ error: "Failed to generate fact." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Eco Buddy Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
