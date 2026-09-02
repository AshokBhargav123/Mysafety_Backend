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
  getDriverDetailsService,
} from "../services/driver.service";

import {
  uploadFileService,
  getSignedUrlService,
  deleteFileService,
} from "../services/upload.service";

export const addDriver = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    // const data =
    //   await addDriverService(
    //     userId,
    //     req.body
    //   );

    let licenseFile: string | undefined;

if (req.file) {
  const uploadedFile =
    await uploadFileService(
      req.file,
      `drivers/${userId}/licenses`
    );

  licenseFile = uploadedFile.key;
}

const data =
  await addDriverService(
    userId,
    {
      ...req.body,
      licenseFile,
    }
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

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    // const result =
    //   await getDriversService(
    //     userId,
    //     page,
    //     limit
    //   );

    const search =
  req.query.search as string | undefined;

const result =
  await getDriversService(
    userId,
    page,
    limit,
    search
  );

    return res.status(200).json({
      success: true,
      message: "driver_list",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    return res.status(500).json({
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

    // const data =
    //   await updateDriverService(
    //     id,
    //     req.body
    //   );

    let licenseFile: string | undefined;

if (req.file) {
  const uploadedFile =
    await uploadFileService(
      req.file,
      `drivers/${(req as any).user.id}/licenses`
    );

  licenseFile = uploadedFile.key;
}

const data =
  await updateDriverService(
    id,
    {
      ...req.body,
      licenseFile,
    }
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

export const getDriverDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    const driver = await getDriverDetailsService(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Driver details fetched successfully",
      data: driver,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};