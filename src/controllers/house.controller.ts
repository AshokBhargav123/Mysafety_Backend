import { Request, Response } from "express";

import {
  addHouseService,
  getHousesService,
  getHouseService,
  updateHouseService,
  deleteHouseService,
  assignHouseMembersService,
  getHouseMembersService
} from "../services/house.service";


export const addHouse = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data = await addHouseService(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "House created successfully",
      data,
    });
  } catch (error: any) {
    console.log(error);

    if (
      error.code === 11000 ||
      error.message === "House already exists"
    ) {
      return res.status(400).json({
        success: false,
        message: "House already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHouses = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data = await getHousesService(userId);

    return res.status(200).json({
      success: true,
      message: "House list fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHouse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const data = await getHouseService(id);

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

export const updateHouse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const data = await updateHouseService(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "House updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHouse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await deleteHouseService(id);

    return res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignHouseMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const { houseId, memberIds } = req.body;

    const house = await assignHouseMembersService(
      houseId,
      memberIds
    );

    const data = house!.familyMembers
  .filter((member: any) => member.memberId) 
  .map((member: any) => ({
    _id: member._id,
    memberDetails: {
      name: member.memberId?.name || "",
      phone: member.memberId?.mobile || "",
    },
  }));

    return res.status(200).json({
      success: true,
      message: "Member added to house successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getHouseMembers = async (
  req: Request,
  res: Response
) => {
  try {
   const houseId = req.body.houseId as string;

    const house = await getHouseMembersService(houseId);

    const data = house.familyMembers
      .filter((member: any) => member.memberId)
      .map((member: any) => ({
        _id: member._id,
        memberDetails: {
          name: member.memberId.name || "",
          phone: member.memberId.mobile || "",
        },
      }));

    return res.status(200).json({
      success: true,
      message: "House members fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};