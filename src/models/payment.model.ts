import { Document, Schema, model, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  amount: number;
  currency: string;

  paymentMethod: string;

  status:
    | "created"
    | "pending"
    | "success"
    | "failed"
    | "refunded";

  gateway: "razorpay";

  gatewayResponse?: any;

  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
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

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      default: "razorpay",
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "success",
        "failed",
        "refunded",
      ],
      default: "created",
    },

    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    gatewayResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ planId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = model<IPayment>(
  "Payment",
  paymentSchema
);