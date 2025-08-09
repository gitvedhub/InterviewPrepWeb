// routes/sessionRoutes.js
const express = require("express");
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} = require("../controllers/sessionController");

const { protect } = require("../middlewares/authMiddleware");

const {
  generateInterviewQuestions,
  generateConceptExplanation, // Make sure this is spelled correctly
} = require("../controllers/aiController");

const router = express.Router();

// Session routes
router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);



module.exports = router;
