import { Router } from "express";
import { createNotification, getNotifications } from "../controllers/notifications.controller.js";

const router = Router();

router.post("/users/:id/notifications", createNotification);
router.get("/users/:id/notifications", getNotifications);

export default router;
