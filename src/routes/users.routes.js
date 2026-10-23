import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getLikedReviewIds,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);

router.post("/users/:id/followers", followUser);
router.get("/users/:id/followers", getFollowers);
router.get("/users/:id/followers/:followerId", isFollowing);
router.delete("/users/:id/followers/:followerId", unfollowUser);
router.get("/users/:id/following", getFollowing);

router.get("/users/:id/likes", getLikedReviewIds);

export default router;
