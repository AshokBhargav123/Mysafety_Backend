import { Router } from "express";

import {
  addDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
} from "../../controllers/driver.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/drivers",
  authMiddleware,
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
  updateDriver
);

router.delete(
  "/drivers/:id",
  authMiddleware,
  deleteDriver
);

export default router;