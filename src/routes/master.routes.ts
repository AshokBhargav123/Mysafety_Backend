import { Router } from "express";

import authRoutes from "./user/auth.routes";
import userRoutes from "./user.routes";
import familyMemberRoutes from "./user/familyMember.routes";
import driverRoutes from "./user/driver.routes";
import vehicleEmergencyContactRoutes from "./user/vehicleEmergencyContact.routes";
import houseRoutes from "./user/house.routes";
import vehicle from "./user/vehicle.routes";
import vehicleDocumentRoutes from "./user/vehicleDocument.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", userRoutes);
router.use("/", familyMemberRoutes);
router.use("/", driverRoutes);
router.use("/", vehicleEmergencyContactRoutes);
router.use("/", houseRoutes);
router.use("/", vehicle);
router.use("/", vehicleDocumentRoutes);

export default router;