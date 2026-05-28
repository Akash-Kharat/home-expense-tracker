import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkMonthLock;
    create(createBudgetDto: CreateBudgetDto, familyId: string): Promise<{
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
    findAll(familyId: string, month?: number, year?: number): Promise<({
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
    findOne(id: string, familyId: string): Promise<{
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
    update(id: string, updateBudgetDto: UpdateBudgetDto, familyId: string): Promise<{
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
    remove(id: string, familyId: string): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
    }>;
    getSummary(month: number, year: number, familyId: string): Promise<{
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
}
