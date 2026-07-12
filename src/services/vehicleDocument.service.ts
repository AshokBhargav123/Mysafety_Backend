import Vehicle from "../models/Vehicle";
import VehicleDocument from "../models/VehicleDocument";
import {
  VehicleDocumentCategory,
} from "../constants/vehicleDocument";

export const uploadVehicleDocumentService =
  async (
    userId: string,
    body: any,
    file: Express.Multer.File
  ) => {
    const {
      vehicleId,
      vehicleNumber,
      category,
      uploadMethod,
      expiryDate,
    } = body;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId,
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const existing =
      await VehicleDocument.findOne({
        vehicleId,
        category,
      });

    if (existing) {
      throw new Error(
        `${category} already uploaded`
      );
    }

    const document =
      await VehicleDocument.create({
        userId,
        vehicleId,
        vehicleNumber,
        category,
        uploadMethod,
        fileName: file.originalname,
        document: `/uploads/vehicle/${file.filename}`,
        expiryDate,
      });

    return document;
  };

  export const getVehicleDocumentsService = async (userId: string) => {
  return await VehicleDocument.find({ userId })
    .populate("vehicleId", "vehicleNumber")
    .sort({ createdAt: -1 });
};

export const updateVehicleDocumentService = async (
  userId: string,
  id: string,
  body: any,
  file?: Express.Multer.File
) => {
  const {
    vehicleId,
    vehicleNumber,
    category,
    uploadMethod,
    expiryDate,
  } = body;

  const document = await VehicleDocument.findOne({
    _id: id,
    userId,
  });

  if (!document) {
    throw new Error("Document not found");
  }

  if (vehicleId) {
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId,
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    document.vehicleId = vehicleId;
  }

  if (vehicleNumber) {
    document.vehicleNumber = vehicleNumber;
  }

  if (category) {
    const existing = await VehicleDocument.findOne({
      _id: { $ne: id },
      vehicleId: vehicleId || document.vehicleId,
      category,
    });

    if (existing) {
      throw new Error(`${category} already uploaded`);
    }

    document.category = category;
  }

  if (uploadMethod) {
    document.uploadMethod = uploadMethod;
  }

  if (expiryDate) {
    document.expiryDate = expiryDate;
  }

  if (file) {
    document.fileName = file.originalname;
    document.document = `/uploads/vehicle/${file.filename}`;
  }

  await document.save();

  return document;
};

export const deleteVehicleDocumentService = async (
  userId: string,
  id: string
) => {
  const document = await VehicleDocument.findOne({
    _id: id,
    userId,
  });

  if (!document) {
    throw new Error("Document not found");
  }

  await VehicleDocument.findByIdAndDelete(id);

  return;
};

export const getVehicleDocumentsByCategoryService = async (
  userId: string,
  category: VehicleDocumentCategory
) => {
  const documents = await VehicleDocument.find({
    userId,
    category,
  })
    .populate("vehicleId", "vehicleNumber")
    .sort({ createdAt: -1 });

  return documents.map((doc: any) => ({
    _id: doc._id,
    vehicleId: doc.vehicleId?._id,
    vehicleNumber: doc.vehicleNumber,
    category: doc.category,
    fileUrl: doc.document,
    uploadMethod: doc.uploadMethod,
    expiryDate: doc.expiryDate,
    createdAt: doc.createdAt,
  }));
};