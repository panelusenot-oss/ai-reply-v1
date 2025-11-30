// api/ask.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set this in Vercel's Environment Variables
});

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { key, ask } = req.query;

    if (!key || key !== process.env.MY_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!ask) {
      return res.status(400).json({ error: "Missing ask parameter" });
    }

    // --- CRITICAL CHANGE: Use the standard Chat Completions API ---
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // CHANGED: Use a valid model (e.g., gpt-3.5-turbo)
      messages: [
        { role: "user", content: ask }
      ]
    });

    // Extract the AI output safely
    const reply = response.choices[0].message.content || "No reply from AI";
    // --- CRITICAL CHANGE ENDS HERE ---

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Function error:", err.message || err);
    return res.status(500).json({ error: "AI function failed" });
  }
}
