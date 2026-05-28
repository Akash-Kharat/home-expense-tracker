import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    create(createInvitationDto: CreateInvitationDto, req: any): Promise<{
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
    findAll(req: any): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        familyId: string;
        createdAt: Date;
        used: boolean;
        expiresAt: Date;
    }[]>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
