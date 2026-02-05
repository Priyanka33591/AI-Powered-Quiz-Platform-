import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  throw new Error("OPENROUTER_API_KEY missing in .env");
}


export const generateQuizQuestions = async (text, language, numQuestions) => {
  const prompt = `
Generate ${numQuestions} MCQ questions in ${language}.
Return ONLY JSON array:

[
 { "question":"...", "options":["A","B","C","D"], "correctAnswer":0, "explanation":"..." }
]

Content:
${text}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    })
  });

  const data = await response.json();

  let output = data.choices[0].message.content;
  if (!output || typeof output !== "string") {
    throw new Error("AI returned empty or invalid response");
  }

  output = output.replace(/```json/g, "").replace(/```/g, "").trim();

  let questions;
  try {
    questions = JSON.parse(output);
  } catch (parseError) {
    // Response may be truncated (e.g. token limit) or have unescaped chars - try to recover
    questions = tryParseTruncatedJson(output);
    if (!questions) {
      const msg = parseError.message || "Invalid JSON";
      throw new Error(
        `AI response could not be parsed (${msg}). Try fewer questions (e.g. 20–50) or re-upload.`
      );
    }
  }

  if (!Array.isArray(questions)) {
    throw new Error("AI did not return a question array");
  }

  return questions;
};

/**
 * Try to extract a valid JSON array from truncated or slightly malformed output.
 * Handles truncation at token limit by finding the last complete object boundary.
 */
function tryParseTruncatedJson(raw) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("[")) return null;

  // Strategy 1: find last "},\s*{" (boundary between two objects) - handles truncated output
  const boundaryRe = /\}\s*,\s*\{/g;
  let lastBoundaryPos = -1;
  let m;
  while ((m = boundaryRe.exec(trimmed)) !== null) {
    lastBoundaryPos = m.index; // position of "}"
  }
  if (lastBoundaryPos > 0) {
    const candidate = trimmed.slice(0, lastBoundaryPos + 1) + "]";
    try {
      return JSON.parse(candidate);
    } catch {
      // fall through
    }
  }

  // Strategy 2: brace-depth scan (ignore braces inside strings)
  let depth = 0;
  let inString = false;
  let escape = false;
  let lastCompleteIndex = -1;
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\" && inString) {
      escape = true;
      continue;
    }
    if (inString) {
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) lastCompleteIndex = i;
    }
  }

  if (lastCompleteIndex > 0) {
    const candidate = trimmed.slice(0, lastCompleteIndex + 1) + "]";
    try {
      return JSON.parse(candidate);
    } catch {
      // fall through
    }
  }

  return null;
}
