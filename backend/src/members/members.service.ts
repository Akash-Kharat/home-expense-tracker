import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto, familyId: string) {
    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        familyId,
      },
    });
  }

  async findAll(familyId: string) {
    return this.prisma.member.findMany({
      where: { familyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, familyId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id, familyId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto, familyId: string) {
    await this.findOne(id, familyId);
    return this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });
  }

  async remove(id: string, familyId: string) {
    await this.findOne(id, familyId);
    return this.prisma.member.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
