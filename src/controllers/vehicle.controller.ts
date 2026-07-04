import { Request, Response } from "express";
import { fetchVehicleService } from "../services/vehicle.service";
import { deleteVehicleService } from "../services/vehicle.service";
import { getVehicleDetailsService } from "../services/vehicle.service";
import { createManualVehicleService, getVehiclesService, assignDriverService, removeAssignedDriverService, getAssignedDriverService} from "../services/vehicle.service";


export const fetchVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const { vehicleNumber, regDate } = req.body;

    if (!vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number is required",
      });
    }

    const vehicle = await fetchVehicleService(
      userId,
      vehicleNumber,
      regDate
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId } = req.body;

    await deleteVehicleService(
      userId,
      vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicleDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId } = req.body;

    const vehicle =
      await getVehicleDetailsService(
        userId,
        vehicleId
      );

    return res.status(200).json({
      success: true,
      message: "Vehicle details fetched successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createManualVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const vehicle =
      await createManualVehicleService(
        userId,
        req.body
      );

   return res.status(201).json({
  success: true,
  message: "Vehicle created successfully",
  data: {
    _id: vehicle._id,
    vehicleNumber: vehicle.vehicleNumber,
    model: vehicle.model,
    vehicleType: vehicle.vehicleType,
    isManualEntry: vehicle.isManualEntry,
     createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
  },
});
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicles = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const vehicles = await getVehiclesService(
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle list fetched successfully",
      data: vehicles,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId, driverId } = req.body;

    const vehicle = await assignDriverService(
      userId,
      vehicleId,
      driverId
    );

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeAssignedDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId } = req.body;

    const data = await removeAssignedDriverService(
      userId,
      vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Driver unmapped successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAssignedDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId } = req.body;

    const data = await getAssignedDriverService(
      userId,
      vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Assigned driver fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};