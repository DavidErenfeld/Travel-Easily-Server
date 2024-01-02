import express from "express";
const router = express.Router();
import UsersController from "../controllers/users_controller";

router.get("/", UsersController.get.bind(UsersController));

router.get("/:id", UsersController.getById.bind(UsersController));

router.post("/", UsersController.post.bind(UsersController));

router.put("/:id", UsersController.putById.bind(UsersController));

router.delete("/:id", UsersController.deleteById.bind(UsersController));

export default router;
