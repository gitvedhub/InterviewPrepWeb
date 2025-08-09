const Question = require("../models/Question");
const Session = require("../models/Session");

//@desc Add additional questions to an existing session
//@route POST/api/questions/add
//@access Private
exports.addQuestionsToSession = async (req, res) => {
    try{
    const { sessionId, questions } = req.body;
    if(!sessionId || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Invalid input data "});
    }
    const session = await Session.findById(sessionId);

    if(!session){
        return res.status(404).json({ message: "Session not found"});
    }

    //Create new Questions
    const createdQuestions = await Question.insertMany(
        questions.map((q) => ({
            session: sessionId,
            question: q.question,
            answer: q.answer,
        }))
    );

    //Update session to include new question IDs
    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();
    res.status(201).json(createdQuestions);

    }catch(error){
        res.status(500).json({ message: "Server Error "});
    }
};


//@desc Pin or unpin a question
//@route POST/api/questions/:id/pin
//@access Private
exports.togglePinQuestion = async (req, res) => {
    try{
        const question = await Question.findById(req.params.id);
        if(!question)
        {
            return res
            .status(404)
            .json({ success: false, message: "Question Not Found "});
        }


        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({ success: true, question });
    }
    catch (error)
    {
        res.status(500).json({message: "Server Error "});
    }
};

//@desc Update a note for a question
//@route POST/api/questions/:id/note
//@access Private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (typeof note !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'note' must be a string.",
      });
    }

    console.log("📝 Received note:", note);

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    question.note = note.trim();
    await question.save();

    console.log("✅ Updated question:", question);

    return res.status(200).json({
      success: true,
      question: {
        _id: question._id,
        session: question.session,
        question: question.question,
        answer: question.answer,
        isPinned: question.isPinned,
        note: question.note,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt
      }
    });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};