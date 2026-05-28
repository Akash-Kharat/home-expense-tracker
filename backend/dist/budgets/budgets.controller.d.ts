import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';
export declare class BudgetsController {
    private budgetsService;
    constructor(budgetsService: BudgetsService);
    create(createBudgetDto: CreateBudgetDto, user: any): Promise<{
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }>;
    getSummary(month: string, year: string, user: any): Promise<{
        spent: number;
        remaining: number;
        category: {
            manager: {
                name: string;
                id: string;
                familyId: string;
                createdAt: Date;
                monthlyIncome: number;
                isActive: boolean;
            };
        } & {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }[]>;
    findAll(month: string, year: string, user: any): Promise<({
        category: {
            manager: {
                name: string;
                id: string;
                familyId: string;
                createdAt: Date;
                monthlyIncome: number;
                isActive: boolean;
            };
        } & {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    })[]>;
    findOne(id: string, user: any): Promise<{
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }>;
    update(id: string, updateBudgetDto: UpdateBudgetDto, user: any): Promise<{
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }>;
}
