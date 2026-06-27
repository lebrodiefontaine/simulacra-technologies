const crypto = require("crypto");
const { ensureUserId } = require("../lib/session/userCookie");
const { getServerSupabase } = require("../lib/supabase/server");
const { sendJson } = require("../lib/api/utils");

// Returns the Telegram deeplink ONLY when the user has paid and has a profile.
module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return sendJson(res, 500, { error: "Missing TELEGRAM_BOT_USERNAME" });
  }

  const userId = ensureUserId(req, res);

  try {
    const supabase = getServerSupabase();

    // gate: must have an active subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const active = sub && (sub.status === "active" || sub.status === "trialing");
    if (!active) {
      return sendJson(res, 402, { error: "subscription_required", active: false });
    }

    // must have a companion profile
    const { data: profile } = await supabase
      .from("companion_profiles")
      .select("type_code, type_name")
      .eq("user_id", userId)
      .single();

    if (!profile) {
      return sendJson(res, 409, { error: "no_profile" });
    }

    // reuse an existing token or mint a new one
    let token;
    const { data: existing } = await supabase
      .from("telegram_links")
      .select("token")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (existing && existing.token) {
      token = existing.token;
    } else {
      token = crypto.randomBytes(16).toString("hex");
      const { error: linkError } = await supabase.from("telegram_links").insert({
        user_id: userId,
        token,
      });
      if (linkError) throw linkError;
    }

    return sendJson(res, 200, {
      url: `https://t.me/${botUsername}?start=${token}`,
      type_code: profile.type_code,
      type_name: profile.type_name,
    });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to build deeplink" });
  }
};
