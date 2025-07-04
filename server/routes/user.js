// server/routes/user.js

// Routes related to user information and deletion.

const express = require("express");
const prisma = require("../lib/prisma");
const isAuthenticated = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Get information about the current logged-in user.
router.get("/user", asyncHandler(async (req, res) => {
  if(!req.session.userId) return res.json(null);
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  res.json({ id: user.id, username: user.username });
}));


// Delete the currently authenticated user and all their associated scores.
router.delete("/user", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  await prisma.score.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
}));

module.exports = router;