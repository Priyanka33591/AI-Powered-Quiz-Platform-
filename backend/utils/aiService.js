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

  output = output.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(output);
};
