import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class PaymentController {
  private paymentService = new PaymentService();

  /**
   * Create Razorpay Order
   */
  createOrder = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user._id;
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required.",
        });
      }

      const data = await this.paymentService.createOrder(
        userId,
        planId
      );

      return res.status(201).json({
        success: true,
        message: "Order created successfully.",
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
   * Verify Payment
   */
  verifyPayment = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
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

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        data: payment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get Payment History
   */
  // getPaymentHistory = async (
  //   req: AuthenticatedRequest,
  //   res: Response
  // ) => {
  //   try {
  //     const userId = req.user._id;

  //     const payments =
  //       await this.paymentService.getPaymentHistory(
  //         userId
  //       );

  //     return res.status(200).json({
  //       success: true,
  //       message: "Payment history fetched successfully.",
  //       data: payments,
  //     });
  //   } catch (error: any) {
  //     return res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };

  getPaymentHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result =
      await this.paymentService.getPaymentHistory(
        userId,
        page,
        limit
      );

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully.",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
  /**
   * Get Payment Details
   */
  getPaymentById = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
    //   const { id } = req.params;

    const id = req.params.id as string;

      const payment =
        await this.paymentService.getPaymentById(id);

      return res.status(200).json({
        success: true,
        message: "Payment details fetched successfully.",
        data: payment,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
}