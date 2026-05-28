import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto, familyId: string): Promise<{
        manager: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    }>;
    findAll(familyId: string): Promise<({
        manager: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    })[]>;
    findOne(id: string, familyId: string): Promise<{
        manager: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, familyId: string): Promise<{
        manager: {
            name: string;
            id: string;
            familyId: string;
            createdAt: Date;
            monthlyIncome: number;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    }>;
    remove(id: string, familyId: string): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    }>;
}
