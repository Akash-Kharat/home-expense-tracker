import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
export declare class InvitationsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(createInvitationDto: CreateInvitationDto, user: any): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        familyId: string;
        createdAt: Date;
        used: boolean;
        expiresAt: Date;
    }>;
    accept(acceptInvitationDto: AcceptInvitationDto): Promise<{
        name: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        familyId: string;
    }>;
    findAll(familyId: string): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        familyId: string;
        createdAt: Date;
        used: boolean;
        expiresAt: Date;
    }[]>;
    delete(id: string, familyId: string): Promise<{
        message: string;
    }>;
}
