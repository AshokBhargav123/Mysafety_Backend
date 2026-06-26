import {
  Request,
  Response,
} from "express";

import {
  addDriverService,
  getDriversService,
  getDriverService,
  updateDriverService,
  deleteDriverService,
} from "../services/driver.service";

export const addDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data =
      await addDriverService(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Driver added successfully",
      data,
    });
  } catch (error: any) {
    console.log(error);
  if (
    error.code === 11000 ||
    error.message === "Driver already exists"
  ) {
    return res.status(400).json({
      success: false,
      message: "Driver already exists",
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message,
  });
}
};

export const getDrivers = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const data =
      await getDriversService(userId);

    return res.status(200).json({
      success: true,
      message: "driver_list",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const data =
      await getDriverService(id);

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

export const updateDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const data =
      await updateDriverService(
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Driver updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDriver = async (
  req: Request,
  res: Response
) => {
  try {
   const id = req.params.id as string;

    await deleteDriverService(id);

    return res.status(200).json({
      success: true,
      message:
        "Driver deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};