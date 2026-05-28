"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpenseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_expense_dto_js_1 = require("./create-expense.dto.js");
class UpdateExpenseDto extends (0, swagger_1.PartialType)(create_expense_dto_js_1.CreateExpenseDto) {
}
exports.UpdateExpenseDto = UpdateExpenseDto;
//# sourceMappingURL=update-expense.dto.js.map