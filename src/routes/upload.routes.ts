import { Router } from "express";
import upload from "../middlewares/upload.middleware";
import {
  uploadFile,
  getSignedUrl,
} from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* =========================================================
   UPLOAD FILE
========================================================= */

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

/* =========================================================
   GET SIGNED URL
========================================================= */

router.get(
  "/signed-url",
  authMiddleware,
  getSignedUrl
);

export default router;