import { Router } from "express";

import authRoutes from "./user/auth.routes";
import userRoutes from "./user.routes";
import familyMemberRoutes from "./user/familyMember.routes";
import driverRoutes from "./user/driver.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", userRoutes);
router.use("/", familyMemberRoutes);
router.use("/", driverRoutes);

export default router;