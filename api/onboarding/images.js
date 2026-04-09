const { z } = require("zod");
const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");

const imageSchema = z.object({
  session_id: z.string().min(1),
  image_id: z.string().min(1),
  liked: z.boolean(),
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);

  let payload;
  try {
    payload = imageSchema.parse(await readJsonBody(req));
  } catch (error) {
    return sendJson(res, 400, { error: "Invalid payload" });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("image_preferences").upsert(
      {
        user_id: userId,
        session_id: payload.session_id,
        image_id: payload.image_id,
        liked: payload.liked,
      },
      { onConflict: "session_id,image_id" }
    );

    if (error) throw error;

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to save image preference" });
  }
};
