"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    imgUrl: {
        type: String,
    },
    tokens: {
        type: [String],
        required: false,
    },
    authType: {
        type: String,
        required: true,
        default: "application", // ערך ברירת מחדל עבור משתמשים שנרשמים דרך האפליקציה
    },
});
exports.default = mongoose_1.default.model("User", usersSchema);
//# sourceMappingURL=users_model.js.map