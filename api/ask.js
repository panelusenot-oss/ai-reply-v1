// api/ask.js
// 1. Import the correct Google SDK client
import { GoogleGenAI } from "@google/genai";

// 2. Initialize the client. CRITICAL FIX: Explicitly pass the API key.
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY, 
});

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { key, ask } = req.query;

    if (!key || key !== process.env.MY_API_KEY) {
      // Custom Security Check (401 Unauthorized)
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!ask) {
      // Missing Prompt Check (400 Bad Request)
      return res.status(400).json({ error: "Missing ask parameter" });
    }

    // 3. Call the generateContent endpoint with the model and prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using a stable, fast model
      contents: ask, 
    });

    // 4. Extract the AI output
    const reply = response.text || "No reply from AI";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Function error:", err.message || err);
    // This catches errors like invalid GEMINI_API_KEY or network failures
    return res.status(500).json({ error: "AI function failed", details: err.message });
  }
}
