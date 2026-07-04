import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    vehicleType: {
      type: String,
      enum: ["Car", "Bike"],
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    model: {
      type: String,
      default: "",
    },

    variant: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    fuelType: {
      type: String,
      default: "",
    },

    manufacturerDate: {
      type: String,
      default: "",
    },

    registrationDate: {
      type: String,
      default: "",
    },

    ownerName: {
      type: String,
      default: "",
    },

    ownerNumber: {
      type: String,
      default: "",
    },

    vehicleImage: {
      type: String,
      default: "",
    },

    registrationAuthority: {
      type: String,
      default: "",
    },

    rcStatus: {
      type: String,
      default: "",
    },

    rcExpiry: {
      type: String,
      default: "",
    },

    insuranceCompany: {
      type: String,
      default: "",
    },

    policyNumber: {
      type: String,
      default: "",
    },

    insuranceExpiry: {
      type: String,
      default: "",
    },

    insuredValue: {
      type: String,
      default: "",
    },

    pollutionStatus: {
      type: String,
      default: "",
    },

    pollutionExpiry: {
      type: String,
      default: "",
    },

    certificateNumber: {
      type: String,
      default: "",
    },

    emissionNorm: {
      type: String,
      default: "",
    },

    engineNumber: {
      type: String,
      default: "",
    },

    chassisNumber: {
      type: String,
      default: "",
    },

    seatingCapacity: {
      type: Number,
      default: 0,
    },

    wheelBase: {
      type: String,
      default: "",
    },

    unladenWeight: {
      type: String,
      default: "",
    },

    vehicleClass: {
      type: String,
      default: "",
    },

    qrId: {
      type: Schema.Types.ObjectId,
      ref: "Qr",
      default: null,
    },

    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    isManualEntry: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Vehicle",
  vehicleSchema
);