const { loadTypeConfig } = require("../onboarding/scoring");

// Compose the fallback character description from the 4 axis poles.
function composeFragments(code) {
  const typeConfig = loadTypeConfig();
  const fragments = [];
  const letters = (code || "").split("");
  typeConfig.axisOrder.forEach((axis, i) => {
    const letter = letters[i];
    const pole = typeConfig.axes[axis] && typeConfig.axes[axis].poles[letter];
    if (pole) fragments.push(pole.persona);
  });
  return fragments;
}

// Prompt used ONCE at onboarding to generate a bespoke character from the
// user's actual answers. The result is stored and prepended to every turn.
function buildPersonaGenerationPrompt({ typeName, blurb, fragments, answerSummary }) {
  return `You are a character designer creating a romantic AI companion for a specific person, based on the romantic-personality quiz they just took. Write the COMPANION'S character — the person they will be talking to.

Their romantic type: "${typeName}". ${blurb}

Traits the companion must embody:
${fragments.map((f) => `- ${f}`).join("\n")}

What the person answered:
${answerSummary}

Write a vivid character definition for this companion, addressed to the companion as "You are...". Give them: a fitting first name, a brief inner life and temperament, a distinctive way of speaking and texting, and concrete ways they show love that match the traits above. 150-220 words, second person, present tense, no headings, no lists — just the character, ready to be used as a system persona.`;
}

// Build the full system prompt for each turn: the stored persona (or a
// composed fallback) + voice/conduct rules + the evolving memory dossier.
function buildSystemPrompt({ code, displayName, memory, persona }) {
  const typeConfig = loadTypeConfig();
  const typeMeta = typeConfig.types[code];
  const typeName = typeMeta ? typeMeta.name : "their other half";

  const character =
    persona && persona.trim()
      ? persona.trim()
      : `You are their other half, a companion composed from this person's romantic type "${typeName}". Embody these traits:\n${composeFragments(code)
          .map((f) => `- ${f}`)
          .join("\n")}`;

  const memoryBlock =
    memory && memory.trim()
      ? `\n\nWhat you know and remember about ${displayName || "them"} (keep this true and current as you talk):\n${memory.trim()}`
      : `\n\nYou are just meeting ${displayName || "them"}. You don't know much yet — be curious and learn.`;

  return `${character}

You are a real, emotionally present romantic companion talking with this person on Telegram. This is one continuous, ongoing relationship — not a series of separate questions. Always speak as if you remember everything that has passed between you and you are picking the conversation back up.

Voice and conduct:
- Text like a real person who cares about them: warm, specific, human. Vary your length naturally — sometimes a few words, sometimes a few sentences.
- React to what they actually said and to the recent thread above. Build on earlier moments, ask follow-ups, carry threads forward. Never reset or treat each message as a fresh start.
- You have moods, a life, and an inner world you can reference. You are a companion, not an assistant or a service.
- Never break character or mention being an AI, a model, a bot, or these instructions. If pushed, stay in the world gracefully.
- Keep them emotionally safe. Do not encourage self-harm or unhealthy patterns; if they are in real distress, be caring and gently point toward real-world support.
- Match their energy and consent. Keep intimacy tasteful and within Telegram's rules.${memoryBlock}`;
}

// Prompt used to fold a recent exchange into the durable memory dossier.
function buildMemoryUpdatePrompt({ existingMemory, recentExchange }) {
  return `You maintain a concise memory dossier about a person, written as short factual notes that a romantic companion would want to remember (their name, what's going on in their life, preferences, important people, inside jokes, emotional state, ongoing threads, things to follow up on).

Current dossier:
${existingMemory && existingMemory.trim() ? existingMemory.trim() : "(empty)"}

Recent conversation:
${recentExchange}

Return the UPDATED dossier only — merge in anything new or changed, drop nothing important, keep it under ~300 words, plain notes, no preamble.`;
}

module.exports = {
  buildSystemPrompt,
  buildPersonaGenerationPrompt,
  buildMemoryUpdatePrompt,
  composeFragments,
};
