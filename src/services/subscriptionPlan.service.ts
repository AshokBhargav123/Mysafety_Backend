import { ISubscriptionPlan, SubscriptionPlan } from "../models/subscriptionPlan.model";

export class SubscriptionPlanService {
  /**
   * Create Subscription Plan
   */
  createPlan = async (
    payload: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan> => {
    const {
      name,
      description,
      price,
      currency,
      duration,
      features,
      razorpayPlanId,
    } = payload;

    // Check duplicate plan
    const existingPlan = await SubscriptionPlan.findOne({
      name: name?.trim(),
    });

    if (existingPlan) {
      throw new Error("Subscription plan already exists.");
    }

    const plan = await SubscriptionPlan.create({
      name: name?.trim(),
      description: description?.trim(),
      price,
      currency,
      duration,
      features,
      razorpayPlanId,
    });

    return plan;
  };

  /**
   * Get All Active Plans
   */
  getAllPlans = async (): Promise<ISubscriptionPlan[]> => {
    return await SubscriptionPlan.find({
      isActive: true,
    }).sort({ price: 1 });
  };

  /**
   * Get Plan By Id
   */
  getPlanById = async (
    id: string
  ): Promise<ISubscriptionPlan | null> => {
    const plan = await SubscriptionPlan.findById(id);

    if (!plan || !plan.isActive) {
      throw new Error("Subscription plan not found.");
    }

    return plan;
  };

  /**
   * Update Subscription Plan
   */
  updatePlan = async (
    id: string,
    payload: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan> => {
    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      throw new Error("Subscription plan not found.");
    }

    // Prevent duplicate name
    if (payload.name) {
      const existing = await SubscriptionPlan.findOne({
        name: payload.name.trim(),
        _id: { $ne: id },
      });

      if (existing) {
        throw new Error("Subscription plan already exists.");
      }

      plan.name = payload.name.trim();
    }

    if (payload.description !== undefined)
      plan.description = payload.description.trim();

    if (payload.price !== undefined)
      plan.price = payload.price;

    if (payload.currency !== undefined)
      plan.currency = payload.currency;

    if (payload.duration !== undefined)
      plan.duration = payload.duration;

    if (payload.features !== undefined)
      plan.features = payload.features;

    if (payload.razorpayPlanId !== undefined)
      plan.razorpayPlanId = payload.razorpayPlanId;

    if (payload.isActive !== undefined)
      plan.isActive = payload.isActive;

    await plan.save();

    return plan;
  };

  /**
   * Soft Delete Plan
   */
  deletePlan = async (id: string): Promise<void> => {
    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      throw new Error("Subscription plan not found.");
    }

    plan.isActive = false;

    await plan.save();
  };
}