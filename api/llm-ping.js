// TEMPORARY diagnostic. Open /api/llm-ping in a browser to test the DeepSeek
// connection from the deployed function. Delete this file before launch.
const { chat } = require("../lib/llm/deepseek");
const { sendJson } = require("../lib/api/utils");

module.exports = async (req, res) => {
  const env = {
    has_DEEPSEEK_API_KEY: !!process.env.DEEPSEEK_API_KEY,
    has_LLM_API_KEY: !!process.env.LLM_API_KEY,
    LLM_BASE_URL: process.env.LLM_BASE_URL || "(default) https://api.deepseek.com/v1",
    LLM_MODEL: process.env.LLM_MODEL || "(default) deepseek-chat",
  };

  try {
    const reply = await chat([
      { role: "system", content: "Reply with exactly: pong" },
      { role: "user", content: "ping" },
    ], { max_tokens: 10, temperature: 0 });
    return sendJson(res, 200, { ok: true, env, reply });
  } catch (error) {
    return sendJson(res, 500, { ok: false, env, error: error.message });
  }
};
