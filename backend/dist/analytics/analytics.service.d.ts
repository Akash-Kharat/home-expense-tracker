import { PrismaService } from '../prisma/prisma.service.js';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(month: number, year: number, familyId: string): Promise<{
        totalBudget: number;
        totalSpent: number;
        remaining: number;
        savingsRate: number;
        topCategories: {
            name: string;
            spent: number;
            budget: number;
        }[];
        totalMembers: number;
        memberBreakdown: {
            member: {
                id: string;
                name: string;
                monthlyIncome: number;
            };
            totalSpent: number;
            totalBudget: number;
        }[];
        recentExpenses: {
            id: string;
            amount: number;
            description: string | null;
            expenseDate: string;
            category: {
                name: string;
            };
            paidBy: {
                name: string;
            };
        }[];
        expenseCount: number;
    }>;
    getCategoryTrends(year: number, familyId: string): Promise<{
        name: string;
        months: number[];
    }[]>;
    getMemberTrends(year: number, familyId: string): Promise<{
        name: string;
        months: number[];
    }[]>;
    getBudgetBurn(month: number, year: number, familyId: string): Promise<{
        name: string;
        budget: number;
        spent: number;
        remaining: number;
        burnRate: number;
    }[]>;
}
