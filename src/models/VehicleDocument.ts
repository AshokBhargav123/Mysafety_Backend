import mongoose, { Schema } from "mongoose";

const vehicleDocumentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "RC",
        "Insurance",
        "DrivingLicense",
        "Pollution",
      ],
      required: true,
    },

    uploadMethod: {
      type: String,
      enum: [
        "Camera",
        "Gallery",
        "DigiLocker",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    document: {
      type: String,
      required: true,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "VehicleDocument",
  vehicleDocumentSchema
);