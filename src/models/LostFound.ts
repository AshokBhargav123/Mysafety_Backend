import mongoose, { Schema } from "mongoose";

const lostFoundSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Electronics",
        "Bags",
        "Documents",
        "Vehicle",
        "Pets",
        "Jewellery",
        "Keys",
        "Other",
      ],
      required: true,
    },

    itemPhoto: {
      type: String,
      default: "",
    },

    qrCode: {
      type: String,
      unique: true,
    },

    qrCodeImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "LostFound",
  lostFoundSchema
);