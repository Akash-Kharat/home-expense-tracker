import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, user: any): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<{
        name: string;
        id: string;
        familyId: string;
        createdAt: Date;
        isActive: boolean;
        type: import(".prisma/client").$Enums.CategoryType;
        managerId: string;
    }>;
}
