import { PrismaService } from '../prisma/prisma.service.js';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(action: string, entityType: string, entityId: string, userId: string, familyId: string): Promise<{
        id: string;
        familyId: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string;
        userId: string;
    }>;
    findAll(familyId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            id: string;
            familyId: string;
            createdAt: Date;
            action: string;
            entityType: string;
            entityId: string;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
