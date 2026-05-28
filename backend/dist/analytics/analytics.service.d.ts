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
            amount: number;
        }[];
        expenseCount: number;
    }>;
    getCategoryTrends(year: number, familyId: string): Promise<{
        categoryName: string;
        monthly: number[];
    }[]>;
    getMemberTrends(year: number, familyId: string): Promise<{
        memberName: string;
        monthly: number[];
    }[]>;
    getBudgetBurn(month: number, year: number, familyId: string): Promise<{
        categoryId: string;
        categoryName: string;
        budgeted: number;
        spent: number;
        remaining: number;
        burnRate: number;
    }[]>;
}
