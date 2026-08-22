import { Payment, IPayment } from "../models/payment.model";
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
//   async getPaymentHistory(
//   userId: string,
//   page: number,
//   limit: number
// ) {
//   return await paginate(
//     Payment,
//     {
//       userId,
//     },
//     {
//       page,
//       limit,

//       sort: {
//         createdAt: -1,
//       },

//       select:
//         "planId razorpayOrderId razorpayPaymentId amount currency paymentMethod status paidAt",

//       populate: {
//         path: "planId",
//         select: "name price duration",
//       },
//     }
//   );
// }

async getPaymentHistory(
  userId: string,
  page: number,
  limit: number,
  status?: IPayment["status"],
  fromDate?: string,
  toDate?: string
) {
  const filter: any = {
    userId,
  };

  // Status filter
  if (status) {
    const allowedStatuses = [
      "created",
      "pending",
      "success",
      "failed",
      "refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid payment status.");
    }

    filter.status = status;
  }

  // Date filter
  if (fromDate || toDate) {
    filter.createdAt = {};

    if (fromDate) {
      const startDate = new Date(fromDate);

      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid fromDate.");
      }

      startDate.setHours(0, 0, 0, 0);

      filter.createdAt.$gte = startDate;
    }

    if (toDate) {
      const endDate = new Date(toDate);

      if (isNaN(endDate.getTime())) {
        throw new Error("Invalid toDate.");
      }

      endDate.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = endDate;
    }
  }

  return await paginate(
    Payment,
    filter,
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