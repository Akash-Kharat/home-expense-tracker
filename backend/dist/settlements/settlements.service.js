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
exports.SettlementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let SettlementsService = class SettlementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(month, year, familyId) {
        const expenses = await this.prisma.expense.findMany({
            where: { month, year, familyId },
            include: { category: true },
        });
        const netAmounts = new Map();
        for (const expense of expenses) {
            if (expense.paidByMemberId !== expense.category.managerId) {
                const key = `${expense.category.managerId}:${expense.paidByMemberId}`;
                const reverseKey = `${expense.paidByMemberId}:${expense.category.managerId}`;
                if (netAmounts.has(reverseKey)) {
                    netAmounts.set(reverseKey, (netAmounts.get(reverseKey) || 0) - expense.amount);
                }
                else {
                    netAmounts.set(key, (netAmounts.get(key) || 0) + expense.amount);
                }
            }
        }
        await this.prisma.settlement.deleteMany({
            where: { month, year, familyId, status: 'PENDING' },
        });
        const settlements = [];
        for (const [key, amount] of netAmounts.entries()) {
            if (amount === 0)
                continue;
            const [fromId, toId] = key.split(':');
            if (amount > 0) {
                settlements.push({
                    fromMemberId: fromId,
                    toMemberId: toId,
                    amount,
                    month,
                    year,
                    familyId,
                    status: 'PENDING',
                });
            }
            else {
                settlements.push({
                    fromMemberId: toId,
                    toMemberId: fromId,
                    amount: Math.abs(amount),
                    month,
                    year,
                    familyId,
                    status: 'PENDING',
                });
            }
        }
        if (settlements.length > 0) {
            await this.prisma.settlement.createMany({ data: settlements });
        }
        return this.findAll(month, year, familyId);
    }
    async findAll(month, year, familyId) {
        return this.prisma.settlement.findMany({
            where: { month, year, familyId },
            include: { fromMember: true, toMember: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markSettled(id, familyId) {
        const settlement = await this.prisma.settlement.findFirst({
            where: { id, familyId },
        });
        if (!settlement) {
            throw new common_1.NotFoundException('Settlement not found');
        }
        return this.prisma.settlement.update({
            where: { id },
            data: { status: 'SETTLED' },
            include: { fromMember: true, toMember: true },
        });
    }
};
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map