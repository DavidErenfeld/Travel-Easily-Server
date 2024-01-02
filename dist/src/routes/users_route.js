"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users_controller_1 = __importDefault(require("../controllers/users_controller"));
router.get("/", users_controller_1.default.get.bind(users_controller_1.default));
router.get("/:id", users_controller_1.default.getById.bind(users_controller_1.default));
router.post("/", users_controller_1.default.post.bind(users_controller_1.default));
router.put("/:id", users_controller_1.default.putById.bind(users_controller_1.default));
router.delete("/:id", users_controller_1.default.deleteById.bind(users_controller_1.default));
exports.default = router;
//# sourceMappingURL=users_route.js.map