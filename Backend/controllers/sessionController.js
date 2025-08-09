const Session = require("../models/Session");
const Question = require("../models/Question");

// @desc Create a new session and linked questions
// @route POST /api/sessions/create
// @access Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions  } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    const fullSession = await Session.findById(session._id).populate("questions");

    res.status(201).json({ success: true, session: fullSession });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// @desc Get a session by ID with populated questions
// @route GET /api/sessions/:id
// @access Private

exports.getMySessions = async (req, res) => {
  try {
    console.log("🔐 Logged-in User ID:", req.user._id);

    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .populate({
        path: "user",
        select: "_id username email", // ✅ Include fields you want to return
      });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("❌ Error in getMySessions:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};





// @desc Get a session by ID with populated questions
// @route GET /api/sessions/:id
// @access Private
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    .populate({
      path : "questions",
      options : { sort: { isPinned: -1, createdAt: 1} },
    })
    .exec();

    if(!session)
    {
      return res
      .status(404)
      .json({ success: false, message: "Session not found "});
    }
 
    res.status(200).json({success : true, session});
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc Delete a session and its questions
// @route DELETE /api/sessions/:id
// @access Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session Not Found" });
    }

    // Check if the logged-in user owns this session
if (session.user.toString() !== req.user._id.toString()) {

      return res
        .status(401)
        .json({ message: "Not authorized to delete this session" });
    }

    // First, delete all questions linked to this session
    await Question.deleteMany({ session: session._id });

    // Then, delete the session itself
    await session.deleteOne();

    res.status(200).json({ message: "Session Deleted Successfully!!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
