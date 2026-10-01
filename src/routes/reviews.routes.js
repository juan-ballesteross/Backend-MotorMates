import { Router } from "express";
import {
  createReview,
  getReviewsByVehicle,
  getReviewsByUser,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

const router = Router();

router.post("/reviews", createReview);
router.get("/vehicles/:id/reviews", getReviewsByVehicle);
router.get("/users/:id/reviews", getReviewsByUser);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

export default router;