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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let BudgetsService = class BudgetsService {
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
    async create(createBudgetDto, familyId) {
        await this.checkMonthLock(createBudgetDto.month, createBudgetDto.year, familyId);
        return this.prisma.budget.create({
            data: {
                ...createBudgetDto,
                familyId,
            },
            include: { category: true },
        });
    }
    async findAll(familyId, month, year) {
        const where = { familyId };
        if (month)
            where.month = month;
        if (year)
            where.year = year;
        return this.prisma.budget.findMany({
            where,
            include: { category: { include: { manager: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, familyId) {
        const budget = await this.prisma.budget.findFirst({
            where: { id, familyId },
            include: { category: true },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return budget;
    }
    async update(id, updateBudgetDto, familyId) {
        const budget = await this.findOne(id, familyId);
        await this.checkMonthLock(budget.month, budget.year, familyId);
        return this.prisma.budget.update({
            where: { id },
            data: updateBudgetDto,
            include: { category: true },
        });
    }
    async remove(id, familyId) {
        const budget = await this.findOne(id, familyId);
        await this.checkMonthLock(budget.month, budget.year, familyId);
        return this.prisma.budget.delete({ where: { id } });
    }
    async getSummary(month, year, familyId) {
        const budgets = await this.prisma.budget.findMany({
            where: { month, year, familyId },
            include: { category: { include: { manager: true } } },
        });
        const expenses = await this.prisma.expense.groupBy({
            by: ['categoryId'],
            where: { month, year, familyId },
            _sum: { amount: true },
        });
        const expenseMap = new Map(expenses.map((e) => [e.categoryId, e._sum.amount || 0]));
        return budgets.map((budget) => ({
            ...budget,
            spent: expenseMap.get(budget.categoryId) || 0,
            remaining: budget.amount - (expenseMap.get(budget.categoryId) || 0),
        }));
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map