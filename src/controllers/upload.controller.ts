import { Request, Response } from "express";
import {
  uploadFileService,
  getSignedUrlService,
} from "../services/upload.service";

/* =========================================================
   UPLOAD FILE
========================================================= */

export const uploadFile = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const folder =
      typeof req.body.folder === "string" &&
      req.body.folder.trim()
        ? req.body.folder.trim()
        : "uploads";

    const result = await uploadFileService(
      file,
      folder
    );

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Upload failed:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "File upload failed",
    });
  }
};

/* =========================================================
   GET SIGNED URL
========================================================= */

export const getSignedUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const { key } = req.query;

    if (!key || typeof key !== "string") {
      return res.status(400).json({
        success: false,
        message: "File key is required",
      });
    }

    const signedUrl =
      await getSignedUrlService(key);

    return res.status(200).json({
      success: true,
      message: "Signed URL generated successfully",
      data: {
        url: signedUrl,
      },
    });
  } catch (error: any) {
    console.error(
      "Signed URL generation failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate signed URL",
    });
  }
};