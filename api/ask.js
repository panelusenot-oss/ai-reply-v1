// api/ask.js
// 1. Import the correct Google SDK client
import { GoogleGenAI } from "@google/genai";

// 2. Initialize the client. It automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { key, ask } = req.query;

    if (!key || key !== process.env.MY_API_KEY) {
      // Good security practice: Check your custom key
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!ask) {
      return res.status(400).json({ error: "Missing ask parameter" });
    }

    // 3. Call the generateContent endpoint with the correct model and format
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use a valid, accessible Gemini model
      contents: ask, // Simplest form for a text prompt
    });

    // 4. Extract the AI output safely
    const reply = response.text || "No reply from AI";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Function error:", err.message || err);
    return res.status(500).json({ error: "AI function failed" });
  }
}
