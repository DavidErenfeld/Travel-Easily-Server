import express from "express";
const router = express.Router();
import tripsController from "../controllers/trips_controller";
import authMiddleWare from "../common/auth_middleware";

router.get("/", tripsController.get.bind(tripsController));
router.get(
  "/owner/:owner",
  authMiddleWare,
  tripsController.getByOwner.bind(tripsController)
);
router.post("/", authMiddleWare, tripsController.post.bind(tripsController));
router.put(
  "/:id",
  authMiddleWare,
  tripsController.putById.bind(tripsController)
);
router.delete(
  "/:id",
  authMiddleWare,
  tripsController.deleteById.bind(tripsController)
);

export default router;
