import { PrismaService } from '../prisma/prisma.service.js';
export declare class MonthLocksService {
    private prisma;
    constructor(prisma: PrismaService);
    lock(month: number, year: number, familyId: string): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        month: number;
        isLocked: boolean;
    }>;
    unlock(month: number, year: number, familyId: string): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        month: number;
        isLocked: boolean;
    }>;
    getStatus(month: number, year: number, familyId: string): Promise<{
        month: number;
        year: number;
        isLocked: boolean;
    }>;
    isLocked(month: number, year: number, familyId: string): Promise<boolean>;
}
