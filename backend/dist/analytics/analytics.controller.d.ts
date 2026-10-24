import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(month: string, year: string, user: any): Promise<{
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
    getCategoryTrends(year: string, user: any): Promise<{
        name: string;
        months: number[];
    }[]>;
    getMemberTrends(year: string, user: any): Promise<{
        name: string;
        months: number[];
    }[]>;
    getBudgetBurn(month: string, year: string, user: any): Promise<{
        name: string;
        budget: number;
        spent: number;
        remaining: number;
        burnRate: number;
    }[]>;
}
