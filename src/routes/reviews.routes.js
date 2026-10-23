import { Router } from "express";
import {
  createReview,
  getReviewsByVehicle,
  getReviewsByUser,
  getReviewsByUsers,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} from "../controllers/reviews.controller.js";

const router = Router();

router.post("/reviews", createReview);
router.get("/reviews", getReviewsByUsers);
router.get("/vehicles/:id/reviews", getReviewsByVehicle);
router.get("/users/:id/reviews", getReviewsByUser);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

router.post("/reviews/:id/likes", likeReview);
router.delete("/reviews/:id/likes/:userId", unlikeReview);

export default router;
