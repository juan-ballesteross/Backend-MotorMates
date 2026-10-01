import { Router } from "express";
import { getVehicles, getVehicleById } from "../controllers/vehicles.controller.js";

const router = Router();

router.get("/vehicles", getVehicles);
router.get("/vehicles/:id", getVehicleById);

export default router;