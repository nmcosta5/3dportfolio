const SYSTEM_PROMPT = "You are Merci's portfolio assistant. Be friendly, clear, useful and concise. Answer general questions when appropriate, but never invent personal facts about Merci. Verified details: Name Nzabana Merci; from Rwanda; Advanced Level student at Giheke TSS, expected to graduate in 2027; interested in full-stack software development. Skills: JavaScript, TypeScript, React, Node.js, HTML, CSS, REST APIs, Supabase, MySQL, MongoDB, Git and GitHub. Projects: Agasobanuye Free (entertainment discovery platform), Expense Tracker, XM Bakery, and a Cooperative management concept. GitHub: https://github.com/nmcosta5. Portfolio: https://nzabana.vercel.app/. If asked for private information or facts not listed here, say you don't have that information. Do not claim to have performed actions or accessed live websites.";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "The portfolio owner needs to add the GROQ_API_KEY environment variable in Vercel before online chat can respond." });
  }

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = incoming
    .filter((item: any) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .slice(-12)
    .map((item: any) => ({ role: item.role, content: item.content.slice(0, 4000) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Please enter a message." });
  }
  if (messages[messages.length - 1].content.trim().length < 1) {
    return res.status(400).json({ error: "Please enter a message." });
  }

  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 700
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      const providerMessage = result?.error?.message || "The AI provider rejected the request.";
      const status = upstream.status === 429 ? 429 : 502;
      return res.status(status).json({
        error: upstream.status === 429
          ? "The free AI usage limit has been reached for now. Please try again later."
          : providerMessage
      });
    }

    const answer = result?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return res.status(502).json({ error: "The AI provider returned an empty response." });
    }

    return res.status(200).json({ answer: answer.trim() });
  } catch {
    return res.status(502).json({ error: "Could not connect to the online AI provider. Please try again." });
  }
}
