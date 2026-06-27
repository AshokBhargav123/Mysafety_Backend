import { Router } from "express";
import { completeProfile, getProfile } from "../controllers/user.controller";
import upload from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.put(
  "/complete-profile",
  authMiddleware,
  upload.single("profileImage"),
  completeProfile
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

export default router;