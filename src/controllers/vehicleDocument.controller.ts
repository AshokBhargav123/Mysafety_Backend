import { Request, Response } from "express";

import { uploadVehicleDocumentService } from "../services/vehicleDocument.service";
import { getVehicleDocumentsService } from "../services/vehicleDocument.service";
import { updateVehicleDocumentService } from "../services/vehicleDocument.service";
import { deleteVehicleDocumentService } from "../services/vehicleDocument.service";
import { getVehicleDocumentsByCategoryService } from "../services/vehicleDocument.service";
import { VehicleDocumentCategory } from "../constants/vehicleDocument";

export const uploadVehicleDocument =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId = (req as any).user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document is required",
        });
      }

      const data =
        await uploadVehicleDocumentService(
          userId,
          req.body,
          req.file
        );

      return res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully",
        data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const getVehicleDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const documents = await getVehicleDocumentsService(userId);

    return res.status(200).json({
      success: true,
      message: "Vehicle documents fetched successfully",
      data: documents,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVehicleDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    const data = await updateVehicleDocumentService(
      userId,
      id,
      req.body,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle document updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicleDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    await deleteVehicleDocumentService(userId, id);

    return res.status(200).json({
      success: true,
      message: "Vehicle document deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicleDocumentsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.body;

    const data = await getVehicleDocumentsByCategoryService(
  userId,
  category as VehicleDocumentCategory
);
    return res.status(200).json({
      success: true,
      message: `${category} documents fetched successfully`,
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};