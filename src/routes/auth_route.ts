import express from "express";
const router = express.Router();
import AuthController from "../controllers/auth_controller";

router.post("/login", AuthController.login);

router.post("/register", AuthController.register);

router.post("/logout", AuthController.logout);

router.post("/refresh", AuthController.refresh);

export default router;
