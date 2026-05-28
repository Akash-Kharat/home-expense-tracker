import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, familyId: string) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        type: createCategoryDto.type as CategoryType,
        managerId: createCategoryDto.managerId,
        familyId,
      },
      include: { manager: true },
    });
  }

  async findAll(familyId: string) {
    return this.prisma.category.findMany({
      where: { familyId },
      include: { manager: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, familyId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, familyId },
      include: { manager: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, familyId: string) {
    await this.findOne(id, familyId);
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
        ...(updateCategoryDto.type && { type: updateCategoryDto.type as CategoryType }),
        ...(updateCategoryDto.managerId && { managerId: updateCategoryDto.managerId }),
      },
      include: { manager: true },
    });
  }

  async remove(id: string, familyId: string) {
    await this.findOne(id, familyId);
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
