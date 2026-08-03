import { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { PaymentService } from "../services/payment.service";

export class SubscriptionController {
  private paymentService = new PaymentService();
  private subscriptionService = new SubscriptionService();
  

  /**
   * Get My Subscription
   */
  getMySubscription = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!._id;

      const subscription =
        await this.subscriptionService.getMySubscription(
          userId
        );

      return res.status(200).json({
        success: true,
        message: "Subscription fetched successfully.",
        data: subscription,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get Available Plans
   */
  getAvailablePlans = async (
    req: Request,
    res: Response
  ) => {
    try {
      const plans =
        await this.subscriptionService.getAvailablePlans();

      return res.status(200).json({
        success: true,
        message: "Subscription plans fetched successfully.",
        data: plans,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

 /**
 * Initiate Subscription
 */
initiateSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!._id;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required.",
      });
    }

    // Uses PaymentService to create Razorpay Order
    const data = await this.paymentService.createOrder(
      userId,
      planId
    );

    return res.status(200).json({
      success: true,
      message: "Subscription initiated successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Verify Subscription Payment
 */
verifySubscriptionPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!._id;

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required.",
      });
    }

    const payment =
      await this.paymentService.verifyPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

    const subscription =
      await this.subscriptionService.activateSubscription(
        userId,
        payment._id.toString()
      );

    return res.status(200).json({
      success: true,
      message: "Subscription activated successfully.",
      data: {
        payment,
        subscription,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

  /**
   * Cancel Subscription
   */
  cancelSubscription = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!._id

      const subscription =
        await this.subscriptionService.cancelSubscription(
          userId
        );

      return res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully.",
        data: subscription,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Sync Subscription
   */
  syncSubscription = async (
    req: Request,
    res: Response
  ) => {
    try {
    //   const { id } = req.params;

    const id = req.params.id as string;

      const subscription =
        await this.subscriptionService.syncSubscription(id);

      return res.status(200).json({
        success: true,
        message: "Subscription synced successfully.",
        data: subscription,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get Subscription By Id
   */
  getSubscriptionById = async (
    req: Request,
    res: Response
  ) => {
    try {
    //   const { id } = req.params;

    const id = req.params.id as string;

      const subscription =
        await this.subscriptionService.getSubscriptionById(
          id
        );

      return res.status(200).json({
        success: true,
        message: "Subscription fetched successfully.",
        data: subscription,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
}