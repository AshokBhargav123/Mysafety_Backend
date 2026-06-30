import { Router } from "express";

import {
  addHouse,
  getHouses,
  getHouse,
  updateHouse,
  deleteHouse,
  assignHouseMembers,
  getHouseMembers
} from "../../controllers/house.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/houses",
  authMiddleware,
  addHouse
);

router.get(
  "/houses",
  authMiddleware,
  getHouses
);

router.get(
  "/houses/:id",
  authMiddleware,
  getHouse
);

router.patch(
  "/houses/:id",
  authMiddleware,
  updateHouse
);

router.delete(
  "/houses/:id",
  authMiddleware,
  deleteHouse
);

router.post(
  "/assign-members",
  authMiddleware,
  assignHouseMembers
);

router.post(
  "/get-house-members",
  authMiddleware,
  getHouseMembers
);

export default router;