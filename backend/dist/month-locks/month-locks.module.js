"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthLocksModule = void 0;
const common_1 = require("@nestjs/common");
const month_locks_service_js_1 = require("./month-locks.service.js");
const month_locks_controller_js_1 = require("./month-locks.controller.js");
let MonthLocksModule = class MonthLocksModule {
};
exports.MonthLocksModule = MonthLocksModule;
exports.MonthLocksModule = MonthLocksModule = __decorate([
    (0, common_1.Module)({
        controllers: [month_locks_controller_js_1.MonthLocksController],
        providers: [month_locks_service_js_1.MonthLocksService],
        exports: [month_locks_service_js_1.MonthLocksService],
    })
], MonthLocksModule);
//# sourceMappingURL=month-locks.module.js.map