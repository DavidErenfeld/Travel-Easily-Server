"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../models/users_model"));
const base_controller_1 = __importDefault(require("../controllers/base_controller"));
const usersController = (0, base_controller_1.default)(users_model_1.default);
exports.default = usersController;
//# sourceMappingURL=users_controller.js.map