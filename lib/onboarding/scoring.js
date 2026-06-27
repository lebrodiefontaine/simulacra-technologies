const fs = require("fs");
const path = require("path");
const { loadOnboardingConfig } = require("./config");

const typesPath = path.join(process.cwd(), "config", "romantic-types.json");

function loadTypeConfig() {
  return JSON.parse(fs.readFileSync(typesPath, "utf-8"));
}

// answers: { question_id: pole_letter }  e.g. { pace_1: "B", expr_1: "T", ... }
function scoreType(answers) {
  const onboarding = loadOnboardingConfig();
  const typeConfig = loadTypeConfig();

  // map each question to its axis
  const questionAxis = {};
  for (const q of onboarding.questions) {
    if (q.axis) questionAxis[q.id] = q.axis;
  }

  // tally pole letters per axis
  const tally = {}; // axis -> { letter: count }
  for (const [qid, value] of Object.entries(answers || {})) {
    const axis = questionAxis[qid];
    if (!axis) continue;
    tally[axis] = tally[axis] || {};
    tally[axis][value] = (tally[axis][value] || 0) + 1;
  }

  // pick winning pole per axis, in fixed order
  const codeLetters = [];
  const scores = {};
  for (const axis of typeConfig.axisOrder) {
    const poles = Object.keys(typeConfig.axes[axis].poles);
    const counts = tally[axis] || {};
    let best = poles[0];
    let bestCount = -1;
    for (const pole of poles) {
      const c = counts[pole] || 0;
      if (c > bestCount) {
        best = pole;
        bestCount = c;
      }
    }
    codeLetters.push(best);
    scores[axis] = { pole: best, counts };
  }

  const code = codeLetters.join("");
  const typeMeta = typeConfig.types[code] || { name: code, blurb: "" };

  return { code, name: typeMeta.name, blurb: typeMeta.blurb, scores };
}

module.exports = { loadTypeConfig, scoreType };
