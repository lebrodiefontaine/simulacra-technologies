const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);
  try {
    await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: "Invalid payload" });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("onboarding_sessions")
      .insert({
        user_id: userId,
        status: "in_progress",
        answers_json: {},
      })
      .select("id")
      .single();

    if (error) throw error;
    return sendJson(res, 200, { session_id: data.id });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to start onboarding session" });
  }
};
