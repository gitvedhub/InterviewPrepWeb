const express = require('express');
const router = express.Router(); // ✅ Declare router first!

const {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession
  
} = require('../controllers/questionController');

const { protect } = require('../middlewares/authMiddleware');

// ✅ Add new questions to a session
router.post('/add', protect, addQuestionsToSession);

// ✅ Toggle pinned status
router.post('/:id/pin', protect, togglePinQuestion);

// ✅ Update question note
router.post('/:id/note', protect, updateQuestionNote);

 // ✅ This was previously crashing due to wrong order

module.exports = router;