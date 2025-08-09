// controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: extract the first JSON object/array from a text blob
function extractFirstJson(str) {
  if (!str) return null;
  const withoutFences = String(str)
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
  const match = withoutFences.match(/(\[.*\]|\{.*\})/s);
  return match ? match[0] : null;
}

// ==============================
// Generate Interview Questions
// ==============================
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt({
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const jsonStr = extractFirstJson(rawText);
    if (!jsonStr) throw new Error("No valid JSON found in AI response");

    const data = JSON.parse(jsonStr);
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error in generateInterviewQuestions:", error);
    return res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// ==============================
// Generate Concept Explanation
// ==============================
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Strip code fences if present, then parse JSON
    const cleaned = String(rawText)
      .replace(/```(?:json)?/gi, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(extractFirstJson(cleaned) || cleaned);
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error in generateConceptExplanation:", error);
    return res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
