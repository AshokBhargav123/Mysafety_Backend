import { Router } from "express";

import {
  addVehicleEmergencyContact,
  getVehicleEmergencyContacts,
  getVehicleEmergencyContact,
  updateVehicleEmergencyContact,
  deleteVehicleEmergencyContact,
} from "../../controllers/vehicleEmergencyContact.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/vehicle-emergency-contacts",
  authMiddleware,
  addVehicleEmergencyContact
);

router.get(
  "/vehicle-emergency-contacts",
  authMiddleware,
  getVehicleEmergencyContacts
);

router.get(
  "/vehicle-emergency-contacts/:id",
  authMiddleware,
  getVehicleEmergencyContact
);

router.put(
  "/vehicle-emergency-contacts",
  authMiddleware,
  updateVehicleEmergencyContact
);

router.delete(
  "/vehicle-emergency-contacts/:id",
  authMiddleware,
  deleteVehicleEmergencyContact
);

export default router;