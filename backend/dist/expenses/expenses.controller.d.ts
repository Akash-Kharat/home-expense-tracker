import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, user: any): Promise<{
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
    findAll(month: string, year: string, categoryId: string, memberId: string, user: any): Promise<({
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
    update(id: string, updateExpenseDto: UpdateExpenseDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<{
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
