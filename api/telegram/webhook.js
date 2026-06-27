const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");
const { sendMessage, sendChatAction } = require("../../lib/telegram/api");
const { chat } = require("../../lib/llm/deepseek");
const {
  buildSystemPrompt,
  buildMemoryUpdatePrompt,
} = require("../../lib/persona/build");

const HISTORY_LIMIT = 30;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  // verify Telegram secret if configured
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const got = req.headers["x-telegram-bot-api-secret-token"];
    if (got !== expectedSecret) {
      return sendJson(res, 401, { error: "unauthorized" });
    }
  }

  let update;
  try {
    update = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 200, { ok: true }); // never make Telegram retry on bad body
  }

  const message = update.message || update.edited_message;
  if (!message || !message.chat) {
    return sendJson(res, 200, { ok: true });
  }

  const chatId = message.chat.id;
  const text = (message.text || "").trim();
  const tgFirstName = message.from?.first_name || null;

  try {
    const supabase = getServerSupabase();

    // ---- /start <token>: link this Telegram chat to a web account ----
    if (text.startsWith("/start")) {
      const parts = text.split(/\s+/);
      const token = parts[1];

      if (token) {
        const { data: link } = await supabase
          .from("telegram_links")
          .select("user_id, token")
          .eq("token", token)
          .single();

        if (link) {
          await supabase
            .from("telegram_links")
            .update({
              telegram_chat_id: chatId,
              telegram_user_id: message.from?.id || null,
              telegram_first_name: tgFirstName,
              linked_at: new Date().toISOString(),
            })
            .eq("token", token);

          const { data: profile } = await supabase
            .from("companion_profiles")
            .select("type_code, type_name, memory, persona")
            .eq("user_id", link.user_id)
            .single();

          const system = buildSystemPrompt({
            code: profile?.type_code,
            displayName: tgFirstName,
            memory: profile?.memory,
            persona: profile?.persona,
          });

          await sendChatAction(chatId, "typing");
          let opener;
          try {
            opener = await chat([
              { role: "system", content: system },
              {
                role: "user",
                content:
                  "(They just opened our chat for the very first time. Greet them warmly and in character, like you've been waiting for them. One short, natural message.)",
              },
            ]);
          } catch (e) {
            console.error("opener generation failed:", e.message);
            opener = "hi. i've been waiting for you. tell me — what's your name?";
          }
          await sendMessage(chatId, opener);
          return sendJson(res, 200, { ok: true });
        }
      }

      await sendMessage(
        chatId,
        "this link isn't active. take the quiz at otherhalf first, and i'll be here."
      );
      return sendJson(res, 200, { ok: true });
    }

    // ---- normal message: resolve the linked account ----
    const { data: link } = await supabase
      .from("telegram_links")
      .select("user_id")
      .eq("telegram_chat_id", chatId)
      .limit(1)
      .single();

    if (!link) {
      await sendMessage(
        chatId,
        "we haven't been introduced yet. open your link from otherhalf to begin."
      );
      return sendJson(res, 200, { ok: true });
    }

    // gate: subscription must be active
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", link.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const active = sub && (sub.status === "active" || sub.status === "trialing");
    if (!active) {
      await sendMessage(
        chatId,
        "i can't reach you right now — your subscription is paused. reactivate it and i'm yours again."
      );
      return sendJson(res, 200, { ok: true });
    }

    if (!text) {
      await sendMessage(chatId, "say that again? i want to hear you.");
      return sendJson(res, 200, { ok: true });
    }

    // load profile + recent history
    const { data: profile } = await supabase
      .from("companion_profiles")
      .select("type_code, type_name, memory, persona")
      .eq("user_id", link.user_id)
      .single();

    const { data: history } = await supabase
      .from("telegram_messages")
      .select("role, content")
      .eq("telegram_chat_id", chatId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    const recent = (history || []).reverse();

    const system = buildSystemPrompt({
      code: profile?.type_code,
      displayName: tgFirstName,
      memory: profile?.memory,
      persona: profile?.persona,
    });

    const messages = [
      { role: "system", content: system },
      ...recent.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    await sendChatAction(chatId, "typing");
    let reply;
    try {
      reply = await chat(messages);
    } catch (e) {
      console.error("chat reply failed:", e.message);
      reply = "i'm here — give me a second, my mind wandered to you.";
    }

    await sendMessage(chatId, reply);

    // persist this exchange
    await supabase.from("telegram_messages").insert([
      { telegram_chat_id: chatId, user_id: link.user_id, role: "user", content: text },
      { telegram_chat_id: chatId, user_id: link.user_id, role: "assistant", content: reply },
    ]);

    // fold the exchange into the durable memory dossier (best-effort)
    try {
      const updated = await chat(
        [
          {
            role: "user",
            content: buildMemoryUpdatePrompt({
              existingMemory: profile?.memory,
              recentExchange: `Them: ${text}\nYou: ${reply}`,
            }),
          },
        ],
        { temperature: 0.2, max_tokens: 400 }
      );
      if (updated && updated.length > 10) {
        await supabase
          .from("companion_profiles")
          .update({ memory: updated, updated_at: new Date().toISOString() })
          .eq("user_id", link.user_id);
      }
    } catch (e) {
      // memory update is non-critical; ignore failures
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    // Always 200 so Telegram doesn't hammer retries; log server-side.
    return sendJson(res, 200, { ok: true });
  }
};
