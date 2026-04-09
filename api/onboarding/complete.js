const { z } = require("zod");
const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");

const completeSchema = z.object({
  session_id: z.string().min(1),
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);

  let payload;
  try {
    payload = completeSchema.parse(await readJsonBody(req));
  } catch (error) {
    return sendJson(res, 400, { error: "Invalid payload" });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("onboarding_sessions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", payload.session_id)
      .eq("user_id", userId);

    if (error) throw error;

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to complete onboarding" });
  }
};
