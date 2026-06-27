import { Request, Response } from "express";

import {
  addVehicleEmergencyContactService,
  getVehicleEmergencyContactsService,
  getVehicleEmergencyContactService,
  updateVehicleEmergencyContactService,
  deleteVehicleEmergencyContactService,
} from "../services/vehicleEmergencyContact.service";

export const addVehicleEmergencyContact = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data =
      await addVehicleEmergencyContactService(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Vehicle emergency contact added successfully",
      data,
    });
  } catch (error: any) {
    if (
      error.code === 11000 ||
      error.message ===
        "Vehicle emergency contact already exists"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle emergency contact already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicleEmergencyContacts =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId = (req as any).user.id;

      const data =
        await getVehicleEmergencyContactsService(
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "vehicle_emergency_contact_list",
        data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getVehicleEmergencyContact =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id as string;

      const data =
        await getVehicleEmergencyContactService(
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

export const updateVehicleEmergencyContact =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.body;

      const data =
        await updateVehicleEmergencyContactService(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Vehicle emergency contact updated successfully",
        data,
      });
    } catch (error: any) {
      if (
        error.code === 11000 ||
        error.message ===
          "Vehicle emergency contact already exists"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Vehicle emergency contact already exists",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteVehicleEmergencyContact =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id as string;

      await deleteVehicleEmergencyContactService(
        id
      );

      return res.status(200).json({
        success: true,
        message:
          "Vehicle emergency contact deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };