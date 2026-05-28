import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MonthLocksService {
  constructor(private prisma: PrismaService) {}

  async lock(month: number, year: number, familyId: string) {
    return this.prisma.monthLock.upsert({
      where: { month_year_familyId: { month, year, familyId } },
      update: { isLocked: true },
      create: { month, year, familyId, isLocked: true },
    });
  }

  async unlock(month: number, year: number, familyId: string) {
    return this.prisma.monthLock.upsert({
      where: { month_year_familyId: { month, year, familyId } },
      update: { isLocked: false },
      create: { month, year, familyId, isLocked: false },
    });
  }

  async getStatus(month: number, year: number, familyId: string) {
    const lock = await this.prisma.monthLock.findUnique({
      where: { month_year_familyId: { month, year, familyId } },
    });
    return {
      month,
      year,
      isLocked: lock?.isLocked || false,
    };
  }

  async isLocked(month: number, year: number, familyId: string): Promise<boolean> {
    const lock = await this.prisma.monthLock.findUnique({
      where: { month_year_familyId: { month, year, familyId } },
    });
    return lock?.isLocked || false;
  }
}
