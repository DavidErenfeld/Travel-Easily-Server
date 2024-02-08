import express from "express";
const router = express.Router();
import tripsController from "../controllers/trips_controller";
import authMiddleWare from "../common/auth_middleware";

router.get("/", tripsController.getAllTrips);
router.get("/:id", authMiddleWare, tripsController.getByOwnerId);
router.get("/trip/:id", authMiddleWare, tripsController.getByTripId);
router.post("/", authMiddleWare, tripsController.post);
router.put("/:id", authMiddleWare, tripsController.putById);
router.delete(
  "/:id",
  authMiddleWare,
  tripsController.deleteById.bind(tripsController)
);

// Add comment
router.post(
  "/comments/:tripId",
  authMiddleWare,
  tripsController.addComment.bind(tripsController)
);

router.delete(
  "/comments/:tripId/:commentId",
  authMiddleWare,
  tripsController.deleteComment.bind(tripsController)
);

// Add like
router.post(
  "/likes/:tripId",
  authMiddleWare,
  tripsController.addLike.bind(tripsController)
);

// Remove like
// router.delete(
//   "/likes/:tripId",
//   authMiddleWare,
//   tripsController.removeLike.bind(tripsController)
// );

export default router;
