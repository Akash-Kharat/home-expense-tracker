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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let ExpensesService = class ExpensesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkMonthLock(month, year, familyId) {
        const lock = await this.prisma.monthLock.findUnique({
            where: { month_year_familyId: { month, year, familyId } },
        });
        if (lock?.isLocked) {
            throw new common_1.BadRequestException(`Month ${month}/${year} is locked. No changes allowed.`);
        }
    }
    async create(createExpenseDto, familyId) {
        await this.checkMonthLock(createExpenseDto.month, createExpenseDto.year, familyId);
        return this.prisma.expense.create({
            data: {
                categoryId: createExpenseDto.categoryId,
                paidByMemberId: createExpenseDto.paidByMemberId,
                amount: createExpenseDto.amount,
                description: createExpenseDto.description,
                expenseDate: createExpenseDto.expenseDate
                    ? new Date(createExpenseDto.expenseDate)
                    : new Date(),
                month: createExpenseDto.month,
                year: createExpenseDto.year,
                familyId,
            },
            include: { category: true, paidBy: true },
        });
    }
    async findAll(familyId, month, year, categoryId, memberId) {
        const where = { familyId };
        if (month)
            where.month = month;
        if (year)
            where.year = year;
        if (categoryId)
            where.categoryId = categoryId;
        if (memberId)
            where.paidByMemberId = memberId;
        return this.prisma.expense.findMany({
            where,
            include: { category: true, paidBy: true },
            orderBy: { expenseDate: 'desc' },
        });
    }
    async findOne(id, familyId) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, familyId },
            include: { category: true, paidBy: true },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async update(id, updateExpenseDto, familyId) {
        const expense = await this.findOne(id, familyId);
        await this.checkMonthLock(expense.month, expense.year, familyId);
        return this.prisma.expense.update({
            where: { id },
            data: {
                ...(updateExpenseDto.categoryId && { categoryId: updateExpenseDto.categoryId }),
                ...(updateExpenseDto.paidByMemberId && {
                    paidByMemberId: updateExpenseDto.paidByMemberId,
                }),
                ...(updateExpenseDto.amount !== undefined && { amount: updateExpenseDto.amount }),
                ...(updateExpenseDto.description !== undefined && {
                    description: updateExpenseDto.description,
                }),
                ...(updateExpenseDto.expenseDate && {
                    expenseDate: new Date(updateExpenseDto.expenseDate),
                }),
            },
            include: { category: true, paidBy: true },
        });
    }
    async remove(id, familyId) {
        const expense = await this.findOne(id, familyId);
        await this.checkMonthLock(expense.month, expense.year, familyId);
        return this.prisma.expense.delete({ where: { id } });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map