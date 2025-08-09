require("dotenv").config(); // Load env variables at the very top
const express = require("express");
const cors = require("cors");
const path = require("path");

// Route imports
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");

// DB and middleware
const connectDB = require("./config/db");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");
const { protect } = require("./middlewares/authMiddleware");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to database once
connectDB();

// ✅ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// AI routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// ✅ Root test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Global Error Handling (Optional)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY || "Not Set");
});
