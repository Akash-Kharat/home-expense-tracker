import { AuditLogsService } from './audit-logs.service.js';
export declare class AuditLogsController {
    private auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(page: string, limit: string, user: any): Promise<{
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
