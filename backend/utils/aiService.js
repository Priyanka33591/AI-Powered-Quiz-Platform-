import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error("OPENROUTER_API_KEY missing in .env");
}

export const generateQuizQuestions = async (text, language, numQuestions) => {
  try {
    // 🔒 Limit questions (important for JSON stability)
    const safeNumQuestions = Math.min(numQuestions, 30);

    const prompt = `
Generate ${safeNumQuestions} MCQ questions in ${language}.

STRICT RULES:
- Return ONLY valid JSON array
- No explanation outside JSON
- No markdown
- No extra text

Format:
[
 { "question":"...", "options":["A","B","C","D"], "correctAnswer":0, "explanation":"..." }
]

Content:
${text}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Quiz App"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", 
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000
        })
      }
    );

    // ✅ Check HTTP error
    if (!response.ok) {
      const text = await response.text();
      console.error("HTTP ERROR:", text);
      throw new Error("OpenRouter request failed");
    }

    const data = await response.json();

    console.log("FULL API RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ Safe access
    if (!data?.choices || !data.choices.length) {
      throw new Error(
        data?.error?.message || "No choices returned from OpenRouter"
      );
    }

    let output = data.choices[0]?.message?.content;

    if (!output || typeof output !== "string") {
      throw new Error("AI returned empty or invalid response");
    }

    // 🧹 Clean markdown if present
    output = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(output);
    } catch (parseError) {
      // 🧠 Try recovery if JSON broken
      questions = tryParseTruncatedJson(output);

      if (!questions) {
        throw new Error(
          "AI returned invalid JSON. Try fewer questions or smaller input."
        );
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI did not return an array");
    }

    return questions;

  } catch (error) {
    console.error("AI SERVICE ERROR:", error.message);
    throw error;
  }
};

/**
 * 🔧 Fix truncated JSON (very important for LLM responses)
 */
function tryParseTruncatedJson(raw) {
  const trimmed = raw.trim();

  if (!trimmed.startsWith("[")) return null;

  // Strategy 1: find last valid object boundary
  const boundaryRe = /\}\s*,\s*\{/g;
  let lastBoundary = -1;
  let match;

  while ((match = boundaryRe.exec(trimmed)) !== null) {
    lastBoundary = match.index;
  }

  if (lastBoundary > 0) {
    const candidate = trimmed.slice(0, lastBoundary + 1) + "]";
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  // Strategy 2: brace depth tracking
  let depth = 0;
  let inString = false;
  let escape = false;
  let lastComplete = -1;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\" && inString) {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") depth++;
      if (char === "}") {
        depth--;
        if (depth === 0) lastComplete = i;
      }
    }
  }

  if (lastComplete > 0) {
    const candidate = trimmed.slice(0, lastComplete + 1) + "]";
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}