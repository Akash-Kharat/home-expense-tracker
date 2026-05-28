"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto, familyId) {
        return this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                type: createCategoryDto.type,
                managerId: createCategoryDto.managerId,
                familyId,
            },
            include: { manager: true },
        });
    }
    async findAll(familyId) {
        return this.prisma.category.findMany({
            where: { familyId },
            include: { manager: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, familyId) {
        const category = await this.prisma.category.findFirst({
            where: { id, familyId },
            include: { manager: true },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto, familyId) {
        await this.findOne(id, familyId);
        return this.prisma.category.update({
            where: { id },
            data: {
                ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
                ...(updateCategoryDto.type && { type: updateCategoryDto.type }),
                ...(updateCategoryDto.managerId && { managerId: updateCategoryDto.managerId }),
            },
            include: { manager: true },
        });
    }
    async remove(id, familyId) {
        await this.findOne(id, familyId);
        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map