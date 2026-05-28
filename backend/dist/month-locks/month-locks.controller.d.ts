import { MonthLocksService } from './month-locks.service.js';
import { MonthLockDto } from './dto/month-lock.dto.js';
export declare class MonthLocksController {
    private monthLocksService;
    constructor(monthLocksService: MonthLocksService);
    lock(monthLockDto: MonthLockDto, user: any): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        month: number;
        isLocked: boolean;
    }>;
    unlock(monthLockDto: MonthLockDto, user: any): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        year: number;
        month: number;
        isLocked: boolean;
    }>;
    getStatus(month: string, year: string, user: any): Promise<{
        month: number;
        year: number;
        isLocked: boolean;
    }>;
}
