const { z } = require("zod");
const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");

const answerSchema = z.object({
  session_id: z.string().min(1),
  question_id: z.string().min(1),
  answer: z.string().min(1),
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);

  let payload;
  try {
    payload = answerSchema.parse(await readJsonBody(req));
  } catch (error) {
    return sendJson(res, 400, { error: "Invalid payload" });
  }

  try {
    const supabase = getServerSupabase();

    const { error: answerError } = await supabase.from("onboarding_answers").upsert(
      {
        user_id: userId,
        session_id: payload.session_id,
        question_id: payload.question_id,
        answer: payload.answer,
      },
      { onConflict: "session_id,question_id" }
    );

    if (answerError) throw answerError;

    const { data: session, error: sessionError } = await supabase
      .from("onboarding_sessions")
      .select("answers_json")
      .eq("id", payload.session_id)
      .eq("user_id", userId)
      .single();

    if (sessionError) throw sessionError;

    const answersJson = {
      ...(session.answers_json || {}),
      [payload.question_id]: payload.answer,
    };

    const { error: updateError } = await supabase
      .from("onboarding_sessions")
      .update({ answers_json: answersJson })
      .eq("id", payload.session_id)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return sendJson(res, 200, { ok: true, answers_json: answersJson });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to save answer" });
  }
};
