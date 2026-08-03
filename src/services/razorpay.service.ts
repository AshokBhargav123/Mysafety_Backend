import crypto from "crypto";
import razorpay from "../config/razorpay";

export class RazorpayService {
  /**
   * Create Order
   */
  async createOrder(
    amount: number,
    receipt: string,
    currency: string = "INR"
  ) {
    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency,
      receipt,
    };

    return await razorpay.orders.create(options);
  }

  /**
   * Fetch Order
   */
  async fetchOrder(orderId: string) {
    return await razorpay.orders.fetch(orderId);
  }

  /**
   * Fetch Payment
   */
  async fetchPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId);
  }

  /**
   * Verify Payment Signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === razorpaySignature;
  }

  /**
   * Verify Webhook Signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Refund Payment
   */
  async refundPayment(
    paymentId: string,
    amount?: number
  ) {
    const options: any = {};

    if (amount) {
      options.amount = amount * 100;
    }

    return await razorpay.payments.refund(
      paymentId,
      options
    );
  }

  /**
   * Create Razorpay Plan
   */
  async createPlan(
    name: string,
    amount: number,
    currency: string = "INR",
    period: "daily" | "weekly" | "monthly" | "yearly" = "yearly",
    interval: number = 1
  ) {
    return await razorpay.plans.create({
      period,
      interval,
      item: {
        name,
        amount: amount * 100,
        currency,
      },
    } as any);
  }

  /**
   * Fetch Plan
   */
  async fetchPlan(planId: string) {
    return await razorpay.plans.fetch(planId);
  }

  /**
   * Create Customer
   */
  async createCustomer(
    name: string,
    email: string,
    contact: string
  ) {
    return await razorpay.customers.create({
      name,
      email,
      contact,
    });
  }

  /**
   * Create Subscription
   */
  async createSubscription(
    razorpayPlanId: string,
    customerId: string,
    totalCount: number = 12
  ) {
    return await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_id: customerId,
      total_count: totalCount,
      quantity: 1,
      customer_notify: 1,
    } as any);
  }

  /**
   * Fetch Subscription
   */
  async fetchSubscription(subscriptionId: string) {
    return await razorpay.subscriptions.fetch(
      subscriptionId
    );
  }

  /**
   * Cancel Subscription
   */
  async cancelSubscription(subscriptionId: string) {
    return await razorpay.subscriptions.cancel(
      subscriptionId,
      true
    );
  }
}