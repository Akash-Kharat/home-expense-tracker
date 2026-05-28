"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_member_dto_js_1 = require("./create-member.dto.js");
class UpdateMemberDto extends (0, swagger_1.PartialType)(create_member_dto_js_1.CreateMemberDto) {
}
exports.UpdateMemberDto = UpdateMemberDto;
//# sourceMappingURL=update-member.dto.js.map