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
            amount: number;
        }[];
        expenseCount: number;
    }>;
    getCategoryTrends(year: string, user: any): Promise<{
        categoryName: string;
        monthly: number[];
    }[]>;
    getMemberTrends(year: string, user: any): Promise<{
        memberName: string;
        monthly: number[];
    }[]>;
    getBudgetBurn(month: string, year: string, user: any): Promise<{
        categoryId: string;
        categoryName: string;
        budgeted: number;
        spent: number;
        remaining: number;
        burnRate: number;
    }[]>;
}
