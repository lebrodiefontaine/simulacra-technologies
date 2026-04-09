const fs = require("fs");
const path = require("path");

const configPath = path.join(process.cwd(), "config", "onboarding.json");

function loadOnboardingConfig() {
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}

function getQuestionById(config, id) {
  return config.questions.find((question) => question.id === id) || null;
}

function resolveNextQuestion(question, answer) {
  if (!question || !question.next) return null;
  if (typeof question.next === "string") return question.next;
  if (question.next.when && Array.isArray(question.next.when)) {
    const matched = question.next.when.find((rule) => rule.equals === answer);
    if (matched) return matched.goto;
  }
  return question.next.default || null;
}

module.exports = {
  loadOnboardingConfig,
  getQuestionById,
  resolveNextQuestion,
};
