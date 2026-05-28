import { SettlementsService } from './settlements.service.js';
import { GenerateSettlementDto } from './dto/generate-settlement.dto.js';
export declare class SettlementsController {
    private settlementsService;
    constructor(settlementsService: SettlementsService);
    generate(generateDto: GenerateSettlementDto, user: any): Promise<({
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
    findAll(month: string, year: string, user: any): Promise<({
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
    markSettled(id: string, user: any): Promise<{
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
