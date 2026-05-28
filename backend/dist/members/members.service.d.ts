import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
export declare class MembersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMemberDto: CreateMemberDto, familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    findAll(familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }[]>;
    findOne(id: string, familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    update(id: string, updateMemberDto: UpdateMemberDto, familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    remove(id: string, familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
}
