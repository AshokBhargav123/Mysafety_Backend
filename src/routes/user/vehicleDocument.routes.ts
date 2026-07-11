import express from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import upload from "../../middlewares/upload.middleware";

import { uploadVehicleDocument } from "../../controllers/vehicleDocument.controller";
import { getVehicleDocuments } from "../../controllers/vehicleDocument.controller";
import { updateVehicleDocument } from "../../controllers/vehicleDocument.controller";
import { deleteVehicleDocument } from "../../controllers/vehicleDocument.controller";

const router = express.Router();

router.post(
  "/vehicle/document",
  authMiddleware,
  upload.single("document"),
  uploadVehicleDocument
);

router.get(
  "/vehicle-document",
  authMiddleware,
  getVehicleDocuments
);

router.put(
  "/vehicle/document/:id",
  authMiddleware,
  upload.single("document"),
  updateVehicleDocument
);

router.delete(
  "/vehicle/document/:id",
  authMiddleware,
  deleteVehicleDocument
);

export default router;