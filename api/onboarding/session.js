const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson } = require("../../lib/api/utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return sendJson(res, 200, { session: data || null });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to load onboarding session" });
  }
};
