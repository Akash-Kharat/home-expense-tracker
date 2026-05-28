"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(month, year, familyId) {
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
        const categorySpending = new Map();
        for (const expense of expenses) {
            const existing = categorySpending.get(expense.categoryId);
            if (existing) {
                existing.amount += expense.amount;
            }
            else {
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
    async getCategoryTrends(year, familyId) {
        const expenses = await this.prisma.expense.findMany({
            where: { year, familyId },
            include: { category: true },
        });
        const trends = new Map();
        for (const expense of expenses) {
            if (!trends.has(expense.categoryId)) {
                trends.set(expense.categoryId, {
                    categoryName: expense.category.name,
                    monthly: new Array(12).fill(0),
                });
            }
            const trend = trends.get(expense.categoryId);
            trend.monthly[expense.month - 1] += expense.amount;
        }
        return Array.from(trends.values());
    }
    async getMemberTrends(year, familyId) {
        const expenses = await this.prisma.expense.findMany({
            where: { year, familyId },
            include: { paidBy: true },
        });
        const trends = new Map();
        for (const expense of expenses) {
            if (!trends.has(expense.paidByMemberId)) {
                trends.set(expense.paidByMemberId, {
                    memberName: expense.paidBy.name,
                    monthly: new Array(12).fill(0),
                });
            }
            const trend = trends.get(expense.paidByMemberId);
            trend.monthly[expense.month - 1] += expense.amount;
        }
        return Array.from(trends.values());
    }
    async getBudgetBurn(month, year, familyId) {
        const budgets = await this.prisma.budget.findMany({
            where: { month, year, familyId },
            include: { category: true },
        });
        const expenses = await this.prisma.expense.groupBy({
            by: ['categoryId'],
            where: { month, year, familyId },
            _sum: { amount: true },
        });
        const expenseMap = new Map(expenses.map((e) => [e.categoryId, e._sum.amount || 0]));
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map