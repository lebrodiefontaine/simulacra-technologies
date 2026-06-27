// Provider-agnostic, OpenAI-compatible chat client.
// Defaults to DeepSeek; swap by changing LLM_BASE_URL / LLM_MODEL / LLM_API_KEY.
const BASE_URL = process.env.LLM_BASE_URL || "https://api.deepseek.com/v1";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";
const API_KEY = process.env.LLM_API_KEY || process.env.DEEPSEEK_API_KEY;

async function chat(messages, options = {}) {
  if (!API_KEY) throw new Error("Missing LLM_API_KEY / DEEPSEEK_API_KEY");

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || MODEL,
      messages,
      temperature: options.temperature != null ? options.temperature : 0.9,
      max_tokens: options.max_tokens || 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = { chat };
