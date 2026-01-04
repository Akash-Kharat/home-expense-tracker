const express = require("express");
const router = express.Router();
const Savings = require("../models/Savings");

// Get all savings
router.get("/", async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const savings = await Savings.find(filter)
      .populate("categoryId")
      .populate("paidBy")
      .sort({ date: -1 });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single savings
router.get("/:id", async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id)
      .populate("categoryId")
      .populate("paidBy");
    if (!savings) {
      return res.status(404).json({ message: "Savings not found" });
    }
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create savings
router.post("/", async (req, res) => {
  const savings = new Savings({
    categoryId: req.body.categoryId,
    paidBy: req.body.paidBy,
    amount: req.body.amount,
    month: req.body.month,
    year: req.body.year,
    frequency: req.body.frequency,
    description: req.body.description,
    date: req.body.date || Date.now(),
  });

  try {
    const newSavings = await savings.save();
    const populatedSavings = await Savings.findById(newSavings._id)
      .populate("categoryId")
      .populate("paidBy");
    res.status(201).json(populatedSavings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update savings
router.put("/:id", async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id);
    if (!savings) {
      return res.status(404).json({ message: "Savings not found" });
    }

    if (req.body.categoryId) savings.categoryId = req.body.categoryId;
    if (req.body.paidBy) savings.paidBy = req.body.paidBy;
    if (req.body.amount !== undefined) savings.amount = req.body.amount;
    if (req.body.month) savings.month = req.body.month;
    if (req.body.year) savings.year = req.body.year;
    if (req.body.frequency) savings.frequency = req.body.frequency;
    if (req.body.description !== undefined)
      savings.description = req.body.description;
    if (req.body.date) savings.date = req.body.date;

    const updatedSavings = await savings.save();
    const populatedSavings = await Savings.findById(updatedSavings._id)
      .populate("categoryId")
      .populate("paidBy");
    res.json(populatedSavings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete savings
router.delete("/:id", async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id);
    if (!savings) {
      return res.status(404).json({ message: "Savings not found" });
    }
    await savings.deleteOne();
    res.json({ message: "Savings deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
