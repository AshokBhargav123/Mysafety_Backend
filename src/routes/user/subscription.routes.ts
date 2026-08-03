import { Router } from "express";
import { SubscriptionController } from "../../controllers/subscription.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const subscriptionController = new SubscriptionController();

router.get(
  "/",
  authMiddleware,
  subscriptionController.getMySubscription
);

router.get(
  "/plans",
  authMiddleware,
  subscriptionController.getAvailablePlans
);

router.post(
  "/initiate",
  authMiddleware,
  subscriptionController.initiateSubscription
);

router.post(
  "/verify",
  authMiddleware,
  subscriptionController.verifySubscriptionPayment
);

router.post(
  "/cancel",
  authMiddleware,
  subscriptionController.cancelSubscription
);

router.get(
  "/sync/:id",
  authMiddleware,
  subscriptionController.syncSubscription
);

// Get subscription by ID
router.get(
  "/:id",
  authMiddleware,
  subscriptionController.getSubscriptionById
);

export default router;
