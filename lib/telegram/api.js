const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function apiUrl(method) {
  if (!TOKEN) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return `https://api.telegram.org/bot${TOKEN}/${method}`;
}

async function call(method, body) {
  const res = await fetch(apiUrl(method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(data)}`);
  }
  return data.result;
}

function sendMessage(chatId, text, extra = {}) {
  return call("sendMessage", { chat_id: chatId, text, ...extra });
}

function sendChatAction(chatId, action = "typing") {
  return call("sendChatAction", { chat_id: chatId, action });
}

module.exports = { call, sendMessage, sendChatAction };
