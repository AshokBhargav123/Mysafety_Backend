import express from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  addPredefinedMessage,
  getPredefinedMessages,
  getPredefinedMessageById,
  updatePredefinedMessage,
  deletePredefinedMessage,
} from "../../controllers/predefinedMessage.controller";

const router = express.Router();

router.post(
  "/predefined-message",
  authMiddleware,
  addPredefinedMessage
);

router.get(
  "/predefined-message",
  authMiddleware,
  getPredefinedMessages
);

router.get(
  "/predefined-message/:id",
  authMiddleware,
  getPredefinedMessageById
);

router.put(
  "/predefined-message/:id",
  authMiddleware,
  updatePredefinedMessage
);

router.delete(
  "/predefined-message/:id",
  authMiddleware,
  deletePredefinedMessage
);

export default router;