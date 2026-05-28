import { MembersService } from './members.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
export declare class MembersController {
    private membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto, user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    findAll(user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }[]>;
    findOne(id: string, user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    update(id: string, updateMemberDto: UpdateMemberDto, user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
    remove(id: string, user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        monthlyIncome: number;
        isActive: boolean;
    }>;
}
