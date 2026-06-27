import mongoose, { Schema } from "mongoose";

const vehicleEmergencyContactSchema = new Schema(
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

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate contacts for the same user
vehicleEmergencyContactSchema.index(
  {
    userId: 1,
    email: 1,
    mobile: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "VehicleEmergencyContact",
  vehicleEmergencyContactSchema
);