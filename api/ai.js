const MAX_MESSAGE_LENGTH = 4000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for AI requests." });
  }

  const message = String(req.body?.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) return res.status(400).json({ error: "Write a question or task first." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI is not configured yet. Add GEMINI_API_KEY in Vercel Environment Variables." });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const instructions = [
    "You are AI HR Demo, a concise HR copilot for fictional demo data.",
    "Help draft onboarding packs, review notes, recognition messages, coaching plans, and general HR operations guidance.",
    "Do not make decisions to hire, fire, promote, demote, discipline, set compensation, or judge an employee.",
    "For any sensitive issue, provide neutral next steps, identify missing facts, and state that a qualified human must review the outcome.",
    "Use short headings and practical bullets. Do not invent company policies or facts."
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${instructions}\n\nUser request:\n${message}` }] }],
          generationConfig: { maxOutputTokens: 700 }
        })
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return res.status(status).json({ error: status === 429 ? "AI is busy. Please try again in a moment." : "AI could not respond right now. Please try again." });
    }
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!reply) return res.status(502).json({ error: "AI returned an empty response. Please try again." });
    return res.status(200).json({ reply });
  } catch {
    return res.status(502).json({ error: "AI could not be reached. Please try again." });
  }
}
