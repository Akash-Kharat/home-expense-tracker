const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const expenses = await Expense.find(filter)
      .populate("categoryId")
      .populate("paidBy")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single expense
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("categoryId")
      .populate("paidBy");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create expense
router.post("/", async (req, res) => {
  const expense = new Expense({
    categoryId: req.body.categoryId,
    paidBy: req.body.paidBy,
    amount: req.body.amount,
    month: req.body.month,
    year: req.body.year,
    description: req.body.description,
    date: req.body.date || Date.now(),
  });

  try {
    const newExpense = await expense.save();
    const populatedExpense = await Expense.findById(newExpense._id)
      .populate("categoryId")
      .populate("paidBy");
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update expense
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (req.body.categoryId) expense.categoryId = req.body.categoryId;
    if (req.body.paidBy) expense.paidBy = req.body.paidBy;
    if (req.body.amount !== undefined) expense.amount = req.body.amount;
    if (req.body.month) expense.month = req.body.month;
    if (req.body.year) expense.year = req.body.year;
    if (req.body.description !== undefined)
      expense.description = req.body.description;
    if (req.body.date) expense.date = req.body.date;

    const updatedExpense = await expense.save();
    const populatedExpense = await Expense.findById(updatedExpense._id)
      .populate("categoryId")
      .populate("paidBy");
    res.json(populatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
