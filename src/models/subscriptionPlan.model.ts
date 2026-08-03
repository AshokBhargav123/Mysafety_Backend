import { Schema, model, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  razorpayPlanId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      default: 365, // Days
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    razorpayPlanId: {
      type: String,
      default: null,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);