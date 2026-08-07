import { Router } from "express";
import { PaymentController } from "../../controllers/payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const paymentController = new PaymentController();

router.post(
  "/create-order",
  authMiddleware,
  paymentController.createOrder
);

router.post(
  "/verify",
  authMiddleware,
  paymentController.verifyPayment
);

router.get(
  "/history",
  authMiddleware,
  paymentController.getPaymentHistory
);

router.get(
  "/:id",
  authMiddleware,
  paymentController.getPaymentById
);

export default router;