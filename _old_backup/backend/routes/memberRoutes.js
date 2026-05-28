const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find({ isActive: true });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single member
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create member
router.post("/", async (req, res) => {
  const member = new Member({
    name: req.body.name,
    monthlyIncome: req.body.monthlyIncome,
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update member
router.put("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (req.body.name) member.name = req.body.name;
    if (req.body.monthlyIncome !== undefined)
      member.monthlyIncome = req.body.monthlyIncome;
    if (req.body.isActive !== undefined) member.isActive = req.body.isActive;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete member (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    member.isActive = false;
    await member.save();
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
