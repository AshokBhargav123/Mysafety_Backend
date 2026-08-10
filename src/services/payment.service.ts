import { Payment } from "../models/payment.model";
import { SubscriptionPlan } from "../models/subscriptionPlan.model";
import { RazorpayService } from "./razorpay.service";
import { paginate } from "../utils/pagination";

export class PaymentService {
  private razorpayService = new RazorpayService();

  /**
   * Create Razorpay Order
   */
  async createOrder(userId: string, planId: string) {

     console.log("========== CREATE ORDER ==========");
  console.log("userId:", userId);
  console.log("planId:", planId);
    // Check plan
    const plan = await SubscriptionPlan.findById(planId);

    console.log("plan:", plan);

    if (!plan || !plan.isActive) {
      throw new Error("Subscription plan not found.");
    }

    // Create Razorpay Order
    const order = await this.razorpayService.createOrder(
      plan.price,
      `receipt_${Date.now()}`,
      plan.currency
    );

    // Save Payment
    const payment = await Payment.create({
      userId,
      planId,
      razorpayOrderId: order.id,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod: "razorpay",
      status: "created",
    });

    return {
      payment,
      order,
    };
  }

 
  async verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  const payment = await Payment.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  // Development Mode
  if (process.env.NODE_ENV === "development") {
    payment.razorpayPaymentId =
      razorpayPaymentId || "pay_mock_123456";

    payment.razorpaySignature =
      razorpaySignature || "mock_signature";

    payment.status = "success";
    payment.gatewayResponse = {
      mode: "mock",
      message: "Payment mocked successfully",
    };
    payment.paidAt = new Date();

    await payment.save();

    return payment;
  }

  // Production Mode
  const verified =
    this.razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

  if (!verified) {
    payment.status = "failed";
    await payment.save();

    throw new Error("Invalid payment signature.");
  }

  const paymentDetails =
    await this.razorpayService.fetchPayment(
      razorpayPaymentId
    );

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "success";
  payment.gatewayResponse = paymentDetails;
  payment.paidAt = new Date();

  await payment.save();

  return payment;
}

  /**
   * Payment History
   */
  // async getPaymentHistory(userId: string) {
  //   return await Payment.find({
  //     userId,
  //   })
  //     .populate("planId", "name price duration")
  //     .sort({
  //       createdAt: -1,
  //     });
  // }

  async getPaymentHistory(
  userId: string,
  page: number,
  limit: number
) {
  return await paginate(
    Payment,
    {
      userId,
    },
    {
      page,
      limit,

      sort: {
        createdAt: -1,
      },

      select:
        "planId razorpayOrderId razorpayPaymentId amount currency paymentMethod status paidAt",

      populate: {
        path: "planId",
        select: "name price duration",
      },
    }
  );
}

  /**
   * Get Payment By Id
   */
  async getPaymentById(paymentId: string) {
  const payment = await Payment.findById(paymentId)
    .populate(
      "planId",
      "name description price currency duration features"
    )
    .populate(
      "subscriptionId",
      "status startDate endDate nextBillingDate autoRenew"
    );

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
}

  /**
   * Update Payment Status
   */
  async updatePaymentStatus(
    paymentId: string,
    status:
      | "created"
      | "pending"
      | "success"
      | "failed"
      | "refunded"
  ) {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    payment.status = status;

    await payment.save();

    return payment;
  }
}