import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  private async checkMonthLock(month: number, year: number, familyId: string) {
    const lock = await this.prisma.monthLock.findUnique({
      where: { month_year_familyId: { month, year, familyId } },
    });
    if (lock?.isLocked) {
      throw new BadRequestException(
        `Month ${month}/${year} is locked. No changes allowed.`,
      );
    }
  }

  async create(createBudgetDto: CreateBudgetDto, familyId: string) {
    await this.checkMonthLock(createBudgetDto.month, createBudgetDto.year, familyId);
    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        familyId,
      },
      include: { category: true },
    });
  }

  async findAll(familyId: string, month?: number, year?: number) {
    const where: any = { familyId };
    if (month) where.month = month;
    if (year) where.year = year;

    return this.prisma.budget.findMany({
      where,
      include: { category: { include: { manager: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, familyId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, familyId },
      include: { category: true },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, familyId: string) {
    const budget = await this.findOne(id, familyId);
    await this.checkMonthLock(budget.month, budget.year, familyId);
    return this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
      include: { category: true },
    });
  }

  async remove(id: string, familyId: string) {
    const budget = await this.findOne(id, familyId);
    await this.checkMonthLock(budget.month, budget.year, familyId);
    return this.prisma.budget.delete({ where: { id } });
  }

  async getSummary(month: number, year: number, familyId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { month, year, familyId },
      include: { category: { include: { manager: true } } },
    });

    const expenses = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { month, year, familyId },
      _sum: { amount: true },
    });

    const expenseMap = new Map(
      expenses.map((e) => [e.categoryId, e._sum.amount || 0]),
    );

    return budgets.map((budget) => ({
      ...budget,
      spent: expenseMap.get(budget.categoryId) || 0,
      remaining: budget.amount - (expenseMap.get(budget.categoryId) || 0),
    }));
  }
}
