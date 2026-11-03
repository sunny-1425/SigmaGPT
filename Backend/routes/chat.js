import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

//Get all threads of logged-in user
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({
      userId: req.userId,
    }).sort({ updatedAt: -1 });

    //descending order of updatedAt...most recent data on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//Get messages of a particular thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.userId,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//Delete a particular thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.userId,
    });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//Chat route
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "threadId and a non-empty message are required",
    });
  }

  try {
    //Find thread belonging to logged-in user
    let thread = await Thread.findOne({
      threadId,
      userId: req.userId,
    });

    if (!thread) {
      // Check whether this threadId already belongs to another user
      const existingThread = await Thread.findOne({ threadId });

      if (existingThread) {
        return res.status(404).json({ error: "Thread not found" });
      }

      //create a new thread in Db
      thread = new Thread({
        threadId,
        userId: req.userId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat request failed:", err);

    return res.status(500).json({
      error: "Failed to generate AI response. Check the backend terminal.",
    });
  }
});

export default router;
