import {
  Request,
  Response,
} from "express";

import {
  addFamilyMemberService,
  getFamilyMembersService,
  updateFamilyMemberService,
  removeFamilyMemberService,
} from "../services/familyMember.service";

export const addFamilyMember =
  async (
    req: Request,
    res: Response
  ) => {
    try {
         console.log("BODY:", req.body);
    console.log("USER:", (req as any).user);
      const ownerId = (req as any)
        .user.id;

      const { mobile } = req.body;

      const data =
        await addFamilyMemberService(
          ownerId,
          mobile
        );

      return res.status(200).json({
        success: true,
        message:
          "Family member added successfully",
        data,
      });
    } catch (error: any) {
        console.log("ERROR:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getFamilyMembers =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const ownerId = (req as any)
        .user.id;

      const data =
        await getFamilyMembersService(
          ownerId
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const updateFamilyMember = async (
  req: Request,
  res: Response
) => {
  try {
    const ownerId = (req as any).user.id;

    const { memberId, mobile } =
      req.body;

    const data =
      await updateFamilyMemberService(
        ownerId,
        memberId,
        mobile
      );

    return res.status(200).json({
      success: true,
      message:
        "Family member updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFamilyMember =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const ownerId = (req as any)
        .user.id;

    const memberId = req.params.memberId as string;

      await removeFamilyMemberService(
        ownerId,
        memberId
      );

      return res.status(200).json({
        success: true,
        message:
          "Family member deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };