import { Request, Response } from "express";

import {
  addPredefinedMessageService,
  getPredefinedMessagesService,
  getPredefinedMessageByIdService,
  updatePredefinedMessageService,
  deletePredefinedMessageService,
} from "../services/predefinedMessage.service";

export const addPredefinedMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data = await addPredefinedMessageService(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Message added successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPredefinedMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data =
      await getPredefinedMessagesService(userId);

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

export const getPredefinedMessageById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const id = req.params.id as string;

    const data =
      await getPredefinedMessageByIdService(
        userId,
        id
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

export const updatePredefinedMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const id = req.params.id as string;

    const data =
      await updatePredefinedMessageService(
        userId,
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePredefinedMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const id = req.params.id as string;

    await deletePredefinedMessageService(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};