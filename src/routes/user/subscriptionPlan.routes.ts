import { Router } from "express";
import { SubscriptionPlanController } from "../../controllers/subscriptionPlan.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const subscriptionPlanController = new SubscriptionPlanController();

router.post(
  "/",
  authMiddleware,
  subscriptionPlanController.createPlan
);

router.get(
  "/",
  authMiddleware,
  subscriptionPlanController.getAllPlans
);

router.get(
  "/:id",
  authMiddleware,
  subscriptionPlanController.getPlanById
);

router.put(
  "/:id",
  authMiddleware,
  subscriptionPlanController.updatePlan
);

router.delete(
  "/:id",
  authMiddleware,
  subscriptionPlanController.deletePlan
);

export default router;