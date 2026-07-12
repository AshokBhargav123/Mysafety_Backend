import mongoose, { Schema } from "mongoose";

const predefinedMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PredefinedMessage",
  predefinedMessageSchema
);