require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testKey() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'API key is working'");
    console.log("✅ Gemini says:", result.response.text());
  } catch (err) {
    console.error("❌ Key test failed:", err.message);
  }
}

testKey();
