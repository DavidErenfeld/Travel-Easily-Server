import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleWare from "../common/auth_middleware";

router.put("/:id", authMiddleWare, userController.updateUserById);

export default router;
