import { Request, Response } from "express";

import {
  sendOtpService,
  verifyOtpService,
} from "../services/auth.service";

export const sendOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { mobile } = req.body;

    await sendOtpService(mobile);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      data: {
        phone: mobile,
        
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { mobile, otp } = req.body;

    const data = await verifyOtpService(
      mobile,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};