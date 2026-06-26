import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    licenseFile: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate drivers for the same user
driverSchema.index(
  {
    userId: 1,
    name: 1,
    mobile: 1,
    licenseNumber: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Driver", driverSchema);