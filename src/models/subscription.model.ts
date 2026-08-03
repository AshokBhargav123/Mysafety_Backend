import { Document, Schema, Types, model } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  paymentId?: Types.ObjectId;

  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;

  status:
    | "pending"
    | "active"
    | "cancelled"
    | "expired"
    | "paused";

  startDate?: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;

  autoRenew: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    razorpaySubscriptionId: {
      type: String,
      default: null,
    },

    razorpayCustomerId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "cancelled",
        "expired",
        "paused",
      ],
      default: "pending",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    nextBillingDate: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);