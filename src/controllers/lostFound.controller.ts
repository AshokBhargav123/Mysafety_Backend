import { Request, Response } from "express";

import { addLostFoundItemService, getLostFoundItemsService, getLostFoundItemByIdService, updateLostFoundItemService, deleteLostFoundItemService } from "../services/lostFound.service";

export const addLostFoundItem = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Item photo is required",
      });
    }

    const data = await addLostFoundItemService(
      userId,
      req.body,
      req.file
    );

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLostFoundItems = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data = await getLostFoundItemsService(userId);

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLostFoundItemById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    const data =
      await getLostFoundItemByIdService(
        userId,
        id
      );

    return res.status(200).json({
      success: true,
      message: "Item fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLostFoundItem = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    const data =
      await updateLostFoundItemService(
        userId,
        id,
        req.body,
        req.file
      );

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLostFoundItem = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    await deleteLostFoundItemService(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};