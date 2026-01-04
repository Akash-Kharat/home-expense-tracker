const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Expense = require("../models/Expense");
const Savings = require("../models/Savings");
const Category = require("../models/Category");

// Get dashboard summary for a specific month/year
router.get("/summary", async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Get all members
    const members = await Member.find({ isActive: true });

    // Get all categories with handlers
    const categories = await Category.find({ isActive: true }).populate(
      "handlerId"
    );

    // Get expenses for the month
    const expenses = await Expense.find({
      month: currentMonth,
      year: currentYear,
    })
      .populate({
        path: "categoryId",
        populate: { path: "handlerId" },
      })
      .populate("paidBy");

    // Get savings for the month
    const savings = await Savings.find({
      month: currentMonth,
      year: currentYear,
    })
      .populate({
        path: "categoryId",
        populate: { path: "handlerId" },
      })
      .populate("paidBy");

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);
    const totalIncome = members.reduce(
      (sum, member) => sum + member.monthlyIncome,
      0
    );

    // Calculate settlement for each member
    const memberBalances = members.map((member) => {
      let paidOut = 0; // What they actually paid
      let shouldReceive = 0; // What they should receive (as handler)

      // Calculate expenses
      expenses.forEach((expense) => {
        // If this member paid
        if (
          expense.paidBy &&
          expense.paidBy._id.toString() === member._id.toString()
        ) {
          paidOut += expense.amount;
        }
        // If this member is the handler (from category)
        if (
          expense.categoryId.handlerId &&
          expense.categoryId.handlerId._id.toString() === member._id.toString()
        ) {
          shouldReceive += expense.amount;
        }
      });

      // Calculate savings
      let savingsPaid = 0;
      savings.forEach((saving) => {
        // If this member paid
        if (
          saving.paidBy &&
          saving.paidBy._id.toString() === member._id.toString()
        ) {
          savingsPaid += saving.amount;
          paidOut += saving.amount;
        }
        // If this member is the handler (from category)
        if (
          saving.categoryId.handlerId &&
          saving.categoryId.handlerId._id.toString() === member._id.toString()
        ) {
          shouldReceive += saving.amount;
        }
      });

      // Net position calculation:
      // Income + (Should Receive as handler) - (Paid Out) - (Savings)
      // But we already counted savings in paidOut, so we need to add it back once
      const netPosition = member.monthlyIncome + shouldReceive - paidOut;

      return {
        memberId: member._id,
        memberName: member.name,
        income: member.monthlyIncome,
        paidOut: paidOut,
        shouldReceive: shouldReceive,
        savingsPaid: savingsPaid,
        netPosition: netPosition,
      };
    });

    // Calculate category-wise breakdown with budgets
    const categoryBreakdown = categories.map((category) => {
      const spent = expenses
        .filter(
          (exp) => exp.categoryId._id.toString() === category._id.toString()
        )
        .reduce((sum, exp) => sum + exp.amount, 0);

      const balance = category.fixedAmount - spent;

      return {
        categoryId: category._id,
        categoryName: category.name,
        budget: category.fixedAmount,
        spent: spent,
        balance: balance,
        handler: category.handlerId ? category.handlerId.name : "Not Set",
      };
    });

    // Calculate over-expenses (expenses made by non-handlers)
    const overExpenses = members.map((member) => {
      const categories = {};

      expenses.forEach((expense) => {
        const isHandler =
          expense.categoryId.handlerId &&
          expense.categoryId.handlerId._id.toString() === member._id.toString();
        const isPayer =
          expense.paidBy &&
          expense.paidBy._id.toString() === member._id.toString();

        // Track when this member paid but is NOT the handler
        if (isPayer && !isHandler) {
          const categoryName = expense.categoryId.name;
          if (!categories[categoryName]) {
            categories[categoryName] = {
              categoryId: expense.categoryId._id,
              categoryName: categoryName,
              handler: expense.categoryId.handlerId
                ? expense.categoryId.handlerId.name
                : "Not Set",
              amount: 0,
            };
          }
          categories[categoryName].amount += expense.amount;
        }
      });

      return {
        memberId: member._id,
        memberName: member.name,
        categories: Object.values(categories),
        totalOverExpense: Object.values(categories).reduce(
          (sum, cat) => sum + cat.amount,
          0
        ),
      };
    });

    const expenseByCategory = expenses.reduce((acc, expense) => {
      const categoryName = expense.categoryId.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += expense.amount;
      return acc;
    }, {});

    const savingsByCategory = savings.reduce((acc, saving) => {
      const categoryName = saving.categoryId.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += saving.amount;
      return acc;
    }, {});

    const totalBalance = totalIncome - totalExpenses - totalSavings;

    res.json({
      month: currentMonth,
      year: currentYear,
      totalIncome,
      totalExpenses,
      totalSavings,
      totalBalance,
      memberBalances,
      categoryBreakdown,
      overExpenses,
      expenseByCategory,
      savingsByCategory,
      expenses,
      savings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get yearly summary
router.get("/yearly-summary", async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const expenses = await Expense.find({ month, year: currentYear });
      const savings = await Savings.find({ month, year: currentYear });

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);

      monthlyData.push({
        month,
        expenses: totalExpenses,
        savings: totalSavings,
      });
    }

    res.json({
      year: currentYear,
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
