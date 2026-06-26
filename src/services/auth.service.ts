import User from "../models/User";
import jwt from "jsonwebtoken";

export const sendOtpService = async (
  mobile: string
) => {
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  let user = await User.findOne({ mobile });

if (!user) {
  user = await User.create({
    mobile,
    role: "user",
    userId: Math.floor(
      10000000 + Math.random() * 90000000
    )
  });
}

  user.otp = otp;
  user.otpExpiry = new Date(
    Date.now() + 5 * 60 * 1000
  );

  await user.save();

  console.log("OTP:", otp);

  return true;
};


export const verifyOtpService = async (
  mobile: string,
  otp: string
) => {
  const user = await User.findOne({ mobile });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    !user.otpExpiry ||
    user.otpExpiry < new Date()
  ) {
    throw new Error("OTP Expired");
  }

  user.isVerified = true;
  user.otp = null;

  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      mobile: user.mobile,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  const isExisting =
    !!user.name && !!user.email;

  return {
    token,
    user: {
      name: user.name || "",
      phone: user.mobile,
      email: user.email || "",
      userId: user.userId,
      isExisting,
      role: user.role || "user",
    },
  };
};