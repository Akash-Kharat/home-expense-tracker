import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';

@Injectable()
export class ExpensesService {
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

  async create(createExpenseDto: CreateExpenseDto, familyId: string) {
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

  async findAll(
    familyId: string,
    month?: number,
    year?: number,
    categoryId?: string,
    memberId?: string,
  ) {
    const where: any = { familyId };
    if (month) where.month = month;
    if (year) where.year = year;
    if (categoryId) where.categoryId = categoryId;
    if (memberId) where.paidByMemberId = memberId;

    return this.prisma.expense.findMany({
      where,
      include: { category: true, paidBy: true },
      orderBy: { expenseDate: 'desc' },
    });
  }

  async findOne(id: string, familyId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, familyId },
      include: { category: true, paidBy: true },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, familyId: string) {
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

  async remove(id: string, familyId: string) {
    const expense = await this.findOne(id, familyId);
    await this.checkMonthLock(expense.month, expense.year, familyId);
    return this.prisma.expense.delete({ where: { id } });
  }
}
