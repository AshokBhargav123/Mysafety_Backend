import { Subscription } from "../models/subscription.model";
import { SubscriptionPlan } from "../models/subscriptionPlan.model";
import { Payment } from "../models/payment.model";
import { RazorpayService } from "./razorpay.service";

export class SubscriptionService {
  private razorpayService = new RazorpayService();

  /**
   * Get Current Subscription
   */
  async getMySubscription(userId: string) {
    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    })
      .populate("planId")
      .populate("paymentId");

    if (!subscription) {
      throw new Error("No active subscription found.");
    }

    return subscription;
  }

  /**
   * Get Available Subscription Plans
   */
  async getAvailablePlans() {
    return await SubscriptionPlan.find({
      isActive: true,
    }).sort({
      price: 1,
    });
  }

  /**
   * Activate Subscription
   */
  async activateSubscription(
    userId: string,
    paymentId: string
  ) {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.status !== "success") {
      throw new Error("Payment not completed.");
    }

    const plan = await SubscriptionPlan.findById(
      payment.planId
    );

    if (!plan) {
      throw new Error("Subscription plan not found.");
    }

    // Expire old subscription
    await Subscription.updateMany(
      {
        userId,
        status: "active",
      },
      {
        status: "expired",
      }
    );

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(
      endDate.getDate() + plan.duration
    );

    const subscription = await Subscription.create({
      userId,
      paymentId: payment._id,
      planId: plan._id,
      status: "active",
      startDate,
      endDate,
      nextBillingDate: endDate,
      autoRenew: true,
    });

    payment.subscriptionId = subscription._id;

    await payment.save();

    return subscription;
  }

  /**
   * Cancel Subscription
   */
  async cancelSubscription(userId: string) {
    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    });

    if (!subscription) {
      throw new Error("Subscription not found.");
    }

    if (subscription.razorpaySubscriptionId) {
      try {
        await this.razorpayService.cancelSubscription(
          subscription.razorpaySubscriptionId
        );
      } catch (error) {}
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;

    await subscription.save();

    return subscription;
  }

  /**
   * Sync Subscription
   */
  async syncSubscription(subscriptionId: string) {
    const subscription =
      await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found.");
    }

    if (!subscription.razorpaySubscriptionId) {
      return subscription;
    }

    const razorpaySubscription =
      await this.razorpayService.fetchSubscription(
        subscription.razorpaySubscriptionId
      );

    const statusMap: Record<string, string> = {
      created: "pending",
      authenticated: "active",
      active: "active",
      halted: "expired",
      cancelled: "cancelled",
      completed: "expired",
      expired: "expired",
    };

    subscription.status =
      (statusMap[
        razorpaySubscription.status
      ] as any) || subscription.status;

    if (razorpaySubscription.current_start) {
      subscription.startDate = new Date(
        razorpaySubscription.current_start * 1000
      );
    }

    if (razorpaySubscription.current_end) {
      subscription.endDate = new Date(
        razorpaySubscription.current_end * 1000
      );

      subscription.nextBillingDate =
        subscription.endDate;
    }

    await subscription.save();

    return subscription;
  }

  /**
   * Get Subscription By Id
   */
  async getSubscriptionById(id: string) {
    const subscription =
      await Subscription.findById(id)
        .populate("planId")
        .populate("paymentId");

    if (!subscription) {
      throw new Error("Subscription not found.");
    }

    return subscription;
  }
}