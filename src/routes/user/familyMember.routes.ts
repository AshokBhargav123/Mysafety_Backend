import { Router } from "express";

import {
  addFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
  removeFamilyMember,
} from "../../controllers/familyMember.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/family-members",
  authMiddleware,
  addFamilyMember
);

router.get(
  "/family-members",
  authMiddleware,
  getFamilyMembers
);

router.put(
  "/family-members",
  authMiddleware,
  updateFamilyMember
);

router.delete(
  "/family-members/:memberId",
  authMiddleware,
  removeFamilyMember
);

export default router;