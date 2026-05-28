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
exports.MonthLocksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let MonthLocksService = class MonthLocksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lock(month, year, familyId) {
        return this.prisma.monthLock.upsert({
            where: { month_year_familyId: { month, year, familyId } },
            update: { isLocked: true },
            create: { month, year, familyId, isLocked: true },
        });
    }
    async unlock(month, year, familyId) {
        return this.prisma.monthLock.upsert({
            where: { month_year_familyId: { month, year, familyId } },
            update: { isLocked: false },
            create: { month, year, familyId, isLocked: false },
        });
    }
    async getStatus(month, year, familyId) {
        const lock = await this.prisma.monthLock.findUnique({
            where: { month_year_familyId: { month, year, familyId } },
        });
        return {
            month,
            year,
            isLocked: lock?.isLocked || false,
        };
    }
    async isLocked(month, year, familyId) {
        const lock = await this.prisma.monthLock.findUnique({
            where: { month_year_familyId: { month, year, familyId } },
        });
        return lock?.isLocked || false;
    }
};
exports.MonthLocksService = MonthLocksService;
exports.MonthLocksService = MonthLocksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], MonthLocksService);
//# sourceMappingURL=month-locks.service.js.map