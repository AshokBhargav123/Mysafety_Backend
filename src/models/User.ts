import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    
 name: String,

 email: {
    type: String,
    unique: true,
    sparse: true
    
  },

  language: {
    type: String,
    default: "English"
  },

    address: {
    fullAddress: String,
    pincode: String,
    landmark: String,
    latitude: Number,
    longitude: Number
  },

   onboardingCompleted: {
    type: Boolean,
    default: false
  },

userId: {
  type: Number,
  unique: true
},
role: {
  type: String,
  default: "user"
},

profileImage: {
  type: String,
  default: "",
},

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);