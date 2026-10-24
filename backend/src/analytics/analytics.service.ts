import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(month: number, year: number, familyId: string) {
    const [budgets, expenses, members] = await Promise.all([
      this.prisma.budget.findMany({
        where: { month, year, familyId },
        include: { category: true },
      }),
      this.prisma.expense.findMany({
        where: { month, year, familyId },
        include: { category: true, paidBy: true },
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.member.findMany({
        where: { familyId, isActive: true },
      }),
    ]);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;
    const savingsRate = totalBudget > 0 ? ((remaining / totalBudget) * 100) : 0;

    // Build budget lookup by categoryId
    const budgetMap = new Map(budgets.map((b) => [b.categoryId, b.amount]));

    // Top categories by spending
    const categorySpending = new Map<string, { name: string; spent: number; budget: number }>();
    for (const expense of expenses) {
      const existing = categorySpending.get(expense.categoryId);
      if (existing) {
        existing.spent += expense.amount;
      } else {
        categorySpending.set(expense.categoryId, {
          name: expense.category.name,
          spent: expense.amount,
          budget: budgetMap.get(expense.categoryId) || 0,
        });
      }
    }

    const topCategories = Array.from(categorySpending.values())
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Member breakdown
    const memberSpending = new Map<string, number>();
    for (const expense of expenses) {
      memberSpending.set(
        expense.paidByMemberId,
        (memberSpending.get(expense.paidByMemberId) || 0) + expense.amount,
      );
    }

    const memberBreakdown = members.map((m) => ({
      member: {
        id: m.id,
        name: m.name,
        monthlyIncome: m.monthlyIncome,
      },
      totalSpent: memberSpending.get(m.id) || 0,
      totalBudget: totalBudget / (members.length || 1),
    }));

    // Recent 5 expenses
    const recentExpenses = expenses.slice(0, 5).map((e) => ({
      id: e.id,
      amount: e.amount,
      description: e.description,
      expenseDate: e.expenseDate.toISOString(),
      category: { name: e.category.name },
      paidBy: { name: e.paidBy.name },
    }));

    return {
      totalBudget,
      totalSpent,
      remaining,
      savingsRate: Math.round(savingsRate * 100) / 100,
      topCategories,
      totalMembers: members.length,
      memberBreakdown,
      recentExpenses,
      expenseCount: expenses.length,
    };
  }

  async getCategoryTrends(year: number, familyId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { year, familyId },
      include: { category: true },
    });

    const trends = new Map<string, { name: string; months: number[] }>();

    for (const expense of expenses) {
      if (!trends.has(expense.categoryId)) {
        trends.set(expense.categoryId, {
          name: expense.category.name,
          months: new Array(12).fill(0),
        });
      }
      const trend = trends.get(expense.categoryId)!;
      trend.months[expense.month - 1] += expense.amount;
    }

    return Array.from(trends.values());
  }

  async getMemberTrends(year: number, familyId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { year, familyId },
      include: { paidBy: true },
    });

    const trends = new Map<string, { name: string; months: number[] }>();

    for (const expense of expenses) {
      if (!trends.has(expense.paidByMemberId)) {
        trends.set(expense.paidByMemberId, {
          name: expense.paidBy.name,
          months: new Array(12).fill(0),
        });
      }
      const trend = trends.get(expense.paidByMemberId)!;
      trend.months[expense.month - 1] += expense.amount;
    }

    return Array.from(trends.values());
  }

  async getBudgetBurn(month: number, year: number, familyId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { month, year, familyId },
      include: { category: true },
    });

    const expenses = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { month, year, familyId },
      _sum: { amount: true },
    });

    const expenseMap = new Map(
      expenses.map((e) => [e.categoryId, e._sum.amount || 0]),
    );

    return budgets.map((budget) => {
      const spent = expenseMap.get(budget.categoryId) || 0;
      return {
        name: budget.category.name,
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        burnRate: budget.amount > 0
          ? Math.round((spent / budget.amount) * 100 * 100) / 100
          : 0,
      };
    });
  }
}
