import { Router } from "express";

import {
  addDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
  getDriverDetails,
} from "../../controllers/driver.controller";
import upload from "../../middlewares/upload.middleware";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/drivers",
  authMiddleware,
  upload.single("licenseFile"),
  addDriver
);

router.get(
  "/drivers",
  authMiddleware,
  getDrivers
);

router.get(
  "/drivers/:id",
  authMiddleware,
  getDriver
);

router.patch(
  "/drivers",
  authMiddleware,
  upload.single("licenseFile"),
  updateDriver
);

router.delete(
  "/drivers/:id",
  authMiddleware,
  deleteDriver
);

router.get(
  "/drivers/:id",
  authMiddleware,
  getDriverDetails
);

export default router;