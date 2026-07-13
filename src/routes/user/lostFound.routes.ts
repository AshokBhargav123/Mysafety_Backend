import express from "express";
import upload from "../../middlewares/upload.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

import { addLostFoundItem, getLostFoundItems, getLostFoundItemById, updateLostFoundItem, deleteLostFoundItem } from "../../controllers/lostFound.controller";

const router = express.Router();

router.post(
  "/lost-found",
  authMiddleware,
  upload.single("itemPhoto"),
  addLostFoundItem
);

router.get(
  "/lost-found",
  authMiddleware,
  getLostFoundItems
);

router.get(
  "/lost-found/:id",
  authMiddleware,
  getLostFoundItemById
);

router.put(
  "/lost-found/:id",
  authMiddleware,
  upload.single("itemPhoto"),
  updateLostFoundItem
);

router.delete(
  "/lost-found/:id",
  authMiddleware,
  deleteLostFoundItem
);

export default router;