import { PrismaService } from '../prisma/prisma.service.js';
export declare class SettlementsService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(month: number, year: number, familyId: string): Promise<({
        fromMember: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
        toMember: {
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
        amount: number;
        month: number;
        status: import(".prisma/client").$Enums.SettlementStatus;
        fromMemberId: string;
        toMemberId: string;
    })[]>;
    findAll(month: number, year: number, familyId: string): Promise<({
        fromMember: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
        toMember: {
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
        amount: number;
        month: number;
        status: import(".prisma/client").$Enums.SettlementStatus;
        fromMemberId: string;
        toMemberId: string;
    })[]>;
    markSettled(id: string, familyId: string): Promise<{
        fromMember: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
        toMember: {
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
        amount: number;
        month: number;
        status: import(".prisma/client").$Enums.SettlementStatus;
        fromMemberId: string;
        toMemberId: string;
    }>;
}
