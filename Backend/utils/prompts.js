// utils/prompts.js

const questionAnswerPrompt = ({ role, experience, topicsToFocus, numberOfQuestions }) => `
You are a JSON-only API. Respond ONLY with valid JSON.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, include it inside a code block.
- Output format must be:

[
  {
    "question": "string",
    "answer": "string"
  }
]

Rules:
- No explanations, no extra text, no markdown, no comments.
- If you cannot answer, return an empty JSON array: []
`;

const conceptExplainPrompt = (question) => `
You are a JSON-only API. Respond ONLY with valid JSON.

Task:
- Explain the following interview question: "${question}"
- Provide a beginner-friendly explanation and a short title.
- If needed, include a code example in the explanation.

Output format:
{
  "title": "string",
  "explanation": "string"
}

Rules:
- No explanations, no extra text, no markdown, no comments.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
