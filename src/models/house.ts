import mongoose, { Schema } from "mongoose";

const houseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    houseName: {
      type: String,
      required: true,
      trim: true,
    },

    houseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    apartment: {
      type: String,
      default: "",
      trim: true,
    },

    fullAddressUrl: {
      type: String,
      required: true,
      trim: true,
    },

    familyMembers: [
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
],

     qrCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("House", houseSchema);