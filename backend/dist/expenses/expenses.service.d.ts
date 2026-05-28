import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkMonthLock;
    create(createExpenseDto: CreateExpenseDto, familyId: string): Promise<{
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
        paidBy: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
        paidByMemberId: string;
        description: string | null;
        expenseDate: Date;
    }>;
    findAll(familyId: string, month?: number, year?: number, categoryId?: string, memberId?: string): Promise<({
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
        paidBy: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
        paidByMemberId: string;
        description: string | null;
        expenseDate: Date;
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
        paidBy: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
        paidByMemberId: string;
        description: string | null;
        expenseDate: Date;
    }>;
    update(id: string, updateExpenseDto: UpdateExpenseDto, familyId: string): Promise<{
        category: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            isActive: boolean;
            type: import(".prisma/client").$Enums.CategoryType;
            managerId: string;
        };
        paidBy: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
        paidByMemberId: string;
        description: string | null;
        expenseDate: Date;
    }>;
    remove(id: string, familyId: string): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        categoryId: string;
        amount: number;
        month: number;
        paidByMemberId: string;
        description: string | null;
        expenseDate: Date;
    }>;
}
