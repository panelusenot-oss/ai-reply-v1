// api/ask.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // your OpenAI API key in Vercel environment
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, ask } = req.query;

  // Simple API key validation
  if (key !== process.env.MY_API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  if (!ask) {
    return res.status(400).json({ error: "Missing ask parameter" });
  }

  try {
    // Call OpenAI Chat API
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: ask }],
    });

    const reply = response.data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI response failed" });
  }
}
