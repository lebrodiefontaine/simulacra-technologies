const { z } = require("zod");
const { ensureUserId } = require("../../lib/session/userCookie");
const { getServerSupabase } = require("../../lib/supabase/server");
const { sendJson, readJsonBody } = require("../../lib/api/utils");
const { scoreType } = require("../../lib/onboarding/scoring");
const { loadOnboardingConfig } = require("../../lib/onboarding/config");
const { composeFragments, buildPersonaGenerationPrompt } = require("../../lib/persona/build");
const { chat } = require("../../lib/llm/deepseek");

const completeSchema = z.object({
  session_id: z.string().min(1),
});

// Turn the raw answers into a readable summary for persona generation.
function summarizeAnswers(answers) {
  const config = loadOnboardingConfig();
  const lines = [];
  for (const q of config.questions) {
    const val = answers[q.id];
    if (!val) continue;
    const opt = (q.options || []).find((o) => o.value === val);
    lines.push(`- ${q.prompt} -> ${opt ? opt.label : val}`);
  }
  return lines.join("\n");
}

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

    const { data: session, error: sessionError } = await supabase
      .from("onboarding_sessions")
      .select("answers_json")
      .eq("id", payload.session_id)
      .eq("user_id", userId)
      .single();

    if (sessionError) throw sessionError;

    const answers = session.answers_json || {};
    const result = scoreType(answers);

    const { error: updateError } = await supabase
      .from("onboarding_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        type_code: result.code,
      })
      .eq("id", payload.session_id)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Generate the bespoke character ONCE from the answers (best-effort).
    let persona = null;
    try {
      persona = await chat(
        [
          {
            role: "user",
            content: buildPersonaGenerationPrompt({
              typeName: result.name,
              blurb: result.blurb,
              fragments: composeFragments(result.code),
              answerSummary: summarizeAnswers(answers),
            }),
          },
        ],
        { temperature: 0.95, max_tokens: 600 }
      );
    } catch (e) {
      console.error("persona generation failed:", e.message);
    }

    const seedMemory = `Their romantic type is "${result.name}" (${result.code}). ${result.blurb}`;
    const { error: profileError } = await supabase.from("companion_profiles").upsert(
      {
        user_id: userId,
        session_id: payload.session_id,
        type_code: result.code,
        type_name: result.name,
        persona: persona || null,
        memory: seedMemory,
      },
      { onConflict: "user_id" }
    );

    if (profileError) throw profileError;

    return sendJson(res, 200, {
      ok: true,
      code: result.code,
      name: result.name,
      blurb: result.blurb,
    });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to complete onboarding" });
  }
};
