import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(month: number, year: number, familyId: string) {
    const [budgets, expenses] = await Promise.all([
      this.prisma.budget.findMany({
        where: { month, year, familyId },
      }),
      this.prisma.expense.findMany({
        where: { month, year, familyId },
        include: { category: true },
      }),
    ]);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;
    const savingsRate = totalBudget > 0 ? ((remaining / totalBudget) * 100) : 0;

    // Top categories by spending
    const categorySpending = new Map<string, { name: string; amount: number }>();
    for (const expense of expenses) {
      const existing = categorySpending.get(expense.categoryId);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        categorySpending.set(expense.categoryId, {
          name: expense.category.name,
          amount: expense.amount,
        });
      }
    }

    const topCategories = Array.from(categorySpending.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalBudget,
      totalSpent,
      remaining,
      savingsRate: Math.round(savingsRate * 100) / 100,
      topCategories,
      expenseCount: expenses.length,
    };
  }

  async getCategoryTrends(year: number, familyId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { year, familyId },
      include: { category: true },
    });

    const trends = new Map<string, { categoryName: string; monthly: number[] }>();

    for (const expense of expenses) {
      if (!trends.has(expense.categoryId)) {
        trends.set(expense.categoryId, {
          categoryName: expense.category.name,
          monthly: new Array(12).fill(0),
        });
      }
      const trend = trends.get(expense.categoryId)!;
      trend.monthly[expense.month - 1] += expense.amount;
    }

    return Array.from(trends.values());
  }

  async getMemberTrends(year: number, familyId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { year, familyId },
      include: { paidBy: true },
    });

    const trends = new Map<string, { memberName: string; monthly: number[] }>();

    for (const expense of expenses) {
      if (!trends.has(expense.paidByMemberId)) {
        trends.set(expense.paidByMemberId, {
          memberName: expense.paidBy.name,
          monthly: new Array(12).fill(0),
        });
      }
      const trend = trends.get(expense.paidByMemberId)!;
      trend.monthly[expense.month - 1] += expense.amount;
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
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        budgeted: budget.amount,
        spent,
        remaining: budget.amount - spent,
        burnRate: budget.amount > 0
          ? Math.round((spent / budget.amount) * 100 * 100) / 100
          : 0,
      };
    });
  }
}
