import { Request, Response } from "express";
import User from "../models/User";
import {
  completeProfileService,
} from "../services/user.service";
import {
  uploadFileService,
  getSignedUrlService,
  deleteFileService,
} from "../services/upload.service";

/* =========================================================
   COMPLETE PROFILE
========================================================= */

export const completeProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    /*
     * Get existing user first.
     * We need the old S3 key so we can delete it
     * after the new image is successfully saved.
     */
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let newProfileImage: string | undefined;
    const oldProfileImage =
      existingUser.profileImage;

    /*
     * =====================================================
     * 1. UPLOAD NEW IMAGE TO S3
     * =====================================================
     */

    if (req.file) {
      const uploadedFile = await uploadFileService(
        req.file,
        `profiles/${userId}`
      );

      newProfileImage = uploadedFile.key;
    }

  
    const body = {
      ...req.body,
      profileImage: newProfileImage,
    };

    let user;

    /*
     * =====================================================
     * 3. UPDATE MONGODB
     * =====================================================
     */

    try {
      user = await completeProfileService(
        userId,
        body
      );
    } catch (error) {
      /*
       * MongoDB update failed.
       *
       * If we already uploaded a new image,
       * delete it because it is now an orphaned S3 object.
       */

      if (newProfileImage) {
        try {
          await deleteFileService(
            newProfileImage
          );
        } catch (deleteError) {
          console.error(
            "Failed to delete newly uploaded S3 file after MongoDB failure:",
            deleteError
          );
        }
      }

      throw error;
    }

    /*
     * =====================================================
     * 4. DELETE OLD IMAGE
     * =====================================================
     *
     * Only delete the old image AFTER MongoDB has
     * successfully stored the new image.
     */

    if (
      newProfileImage &&
      oldProfileImage &&
      oldProfileImage !== newProfileImage
    ) {
      try {
        await deleteFileService(
          oldProfileImage
        );
      } catch (deleteError) {
        /*
         * Profile update was successful.
         *
         * If old-file cleanup fails, don't fail
         * the entire profile update.
         */
        console.error(
          "Failed to delete old profile image from S3:",
          deleteError
        );
      }
    }

    /*
     * =====================================================
     * 5. RESPONSE
     * =====================================================
     */

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(
      "Complete profile error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update profile",
    });
  }
};

/* =========================================================
   GET PROFILE
========================================================= */

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select(
      "name email mobile language address profileImage onboardingCompleted userId role createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
     * Generate temporary signed URL
     * for private S3 object.
     */

    let profileImageUrl: string | null = null;

    if (user.profileImage) {
      profileImageUrl =
        await getSignedUrlService(
          user.profileImage
        );
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        language: user.language,
        address: user.address,
        onboardingCompleted:
          user.onboardingCompleted,
        userId: user.userId,
        role: user.role,
        profileImage: profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error(
      "Get profile error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to get profile",
    });
  }
};