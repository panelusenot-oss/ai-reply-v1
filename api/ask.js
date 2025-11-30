// api/ask.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Keep your key safe in Vercel
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

    // Call OpenAI Responses API (GPT-5 Nano)
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: ask,
      store: true
    });

    // Extract the AI output safely
    const reply = response.output_text || "No reply from AI";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Function error:", err.message || err);
    return res.status(500).json({ error: "AI function failed" });
  }
}
