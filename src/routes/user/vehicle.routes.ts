import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { fetchVehicle, deleteVehicle, getVehicleDetails, createManualVehicle, getVehicles, assignDriver, removeAssignedDriver, getAssignedDriver} from "../../controllers/vehicle.controller";

const router = express.Router();

router.post(
  "/vehicle/fetch",
  authMiddleware,
  fetchVehicle
);

router.delete(
  "/vehicle/delete",
  authMiddleware,
  deleteVehicle
);

router.post(
  "/vehicle/details",
  authMiddleware,
  getVehicleDetails
);

router.post(
  "/vehicle/manual",
  authMiddleware,
  createManualVehicle
);

router.get(
  "/vehicles",
  authMiddleware,
  getVehicles
);

router.post(
  "/vehicle/assign-driver",
  authMiddleware,
  assignDriver
);

router.delete(
  "/vehicle/driver",
  authMiddleware,
  removeAssignedDriver
);

router.post(
  "/vehicle/driver",
  authMiddleware,
  getAssignedDriver
);

export default router;