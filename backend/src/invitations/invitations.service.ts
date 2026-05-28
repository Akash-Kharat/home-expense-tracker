import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createInvitationDto: CreateInvitationDto, user: any) {
    const existingInvite = await this.prisma.invitation.findFirst({
      where: {
        email: createInvitationDto.email,
        familyId: user.familyId,
        used: false,
      },
    });

    if (existingInvite) {
      throw new ConflictException('An invitation already exists for this email');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createInvitationDto.email },
    });

    if (existingUser && existingUser.familyId === user.familyId) {
      throw new ConflictException('User is already a member of this family');
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        email: createInvitationDto.email,
        role: (createInvitationDto.role || 'MEMBER') as Role,
        familyId: user.familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Fetch family name for the email
    const family = await this.prisma.family.findUnique({
      where: { id: user.familyId },
    });

    // Send invitation email
    await this.mailService.sendInvitationEmail(
      createInvitationDto.email,
      user.name || 'A family member',
      family?.name || 'Your Family',
      invitation.token,
    );

    return invitation;
  }

  async accept(acceptInvitationDto: AcceptInvitationDto) {
    const { token, name, password } = acceptInvitationDto;

    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.used) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
        familyId: invitation.familyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        familyId: true,
      },
    });

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { used: true },
    });

    return user;
  }

  async findAll(familyId: string) {
    return this.prisma.invitation.findMany({
      where: { familyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, familyId: string) {
    const invitation = await this.prisma.invitation.findFirst({
      where: { id, familyId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    await this.prisma.invitation.delete({ where: { id } });
    return { message: 'Invitation deleted' };
  }
}
