import { Router } from "express";
import { completeProfile, getProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.put(
  "/complete-profile",
  authMiddleware,
  completeProfile
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

export default router;