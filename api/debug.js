const { ensureUserId } = require("../lib/session/userCookie");
const { getServerSupabase } = require("../lib/supabase/server");
const { sendJson } = require("../lib/api/utils");

module.exports = async (req, res) => {
  const isDebug =
    process.env.DEBUG === "true" || process.env.NODE_ENV !== "production";

  if (!isDebug) {
    return sendJson(res, 404, { error: "Not found" });
  }

  const userId = ensureUserId(req, res);

  try {
    const supabase = getServerSupabase();
    const { data: session } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: answers } = await supabase
      .from("onboarding_answers")
      .select("id")
      .eq("user_id", userId);

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return sendJson(res, 200, {
      user_id: userId,
      session,
      answers_count: answers?.length || 0,
      subscription,
    });
  } catch (error) {
    return sendJson(res, 500, { error: "Debug lookup failed" });
  }
};
