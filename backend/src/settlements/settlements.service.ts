import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettlementsService {
  constructor(private prisma: PrismaService) {}

  async generate(month: number, year: number, familyId: string) {
    // Get all expenses for the month with their categories
    const expenses = await this.prisma.expense.findMany({
      where: { month, year, familyId },
      include: { category: true },
    });

    // Calculate net amounts between member pairs
    // If paidByMemberId != category.managerId, then manager owes paidBy
    const netAmounts = new Map<string, number>();

    for (const expense of expenses) {
      if (expense.paidByMemberId !== expense.category.managerId) {
        // Manager owes the payer
        const key = `${expense.category.managerId}:${expense.paidByMemberId}`;
        const reverseKey = `${expense.paidByMemberId}:${expense.category.managerId}`;

        if (netAmounts.has(reverseKey)) {
          netAmounts.set(
            reverseKey,
            (netAmounts.get(reverseKey) || 0) - expense.amount,
          );
        } else {
          netAmounts.set(
            key,
            (netAmounts.get(key) || 0) + expense.amount,
          );
        }
      }
    }

    // Delete old pending settlements for this month
    await this.prisma.settlement.deleteMany({
      where: { month, year, familyId, status: 'PENDING' },
    });

    // Create new settlements
    const settlements: Prisma.SettlementCreateManyInput[] = [];
    for (const [key, amount] of netAmounts.entries()) {
      if (amount === 0) continue;

      const [fromId, toId] = key.split(':');
      if (amount > 0) {
        settlements.push({
          fromMemberId: fromId,
          toMemberId: toId,
          amount,
          month,
          year,
          familyId,
          status: 'PENDING' as const,
        });
      } else {
        settlements.push({
          fromMemberId: toId,
          toMemberId: fromId,
          amount: Math.abs(amount),
          month,
          year,
          familyId,
          status: 'PENDING' as const,
        });
      }
    }

    if (settlements.length > 0) {
      await this.prisma.settlement.createMany({ data: settlements });
    }

    return this.findAll(month, year, familyId);
  }

  async findAll(month: number, year: number, familyId: string) {
    return this.prisma.settlement.findMany({
      where: { month, year, familyId },
      include: { fromMember: true, toMember: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markSettled(id: string, familyId: string) {
    const settlement = await this.prisma.settlement.findFirst({
      where: { id, familyId },
    });
    if (!settlement) {
      throw new NotFoundException('Settlement not found');
    }
    return this.prisma.settlement.update({
      where: { id },
      data: { status: 'SETTLED' },
      include: { fromMember: true, toMember: true },
    });
  }
}
