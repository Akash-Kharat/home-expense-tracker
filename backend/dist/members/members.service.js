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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let MembersService = class MembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMemberDto, familyId) {
        return this.prisma.member.create({
            data: {
                ...createMemberDto,
                familyId,
            },
        });
    }
    async findAll(familyId) {
        return this.prisma.member.findMany({
            where: { familyId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, familyId) {
        const member = await this.prisma.member.findFirst({
            where: { id, familyId },
        });
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member;
    }
    async update(id, updateMemberDto, familyId) {
        await this.findOne(id, familyId);
        return this.prisma.member.update({
            where: { id },
            data: updateMemberDto,
        });
    }
    async remove(id, familyId) {
        await this.findOne(id, familyId);
        return this.prisma.member.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], MembersService);
//# sourceMappingURL=members.service.js.map