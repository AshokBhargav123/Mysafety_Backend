import Driver from "../models/Driver";

export const addDriverService = async (
  userId: string,
  data: any
) => {
  const existingDriver = await Driver.findOne({
    userId,
    name: data.name.trim(),
    mobile: data.mobile.trim(),
    licenseNumber: data.licenseNumber.trim(),
  });

  if (existingDriver) {
    throw new Error("Driver already exists");
  }

  return Driver.create({
    userId,
    name: data.name.trim(),
    mobile: data.mobile.trim(),
    licenseNumber: data.licenseNumber.trim(),
    licenseFile: data.licenseFile || "",
  });
};

export const getDriversService = async (
  userId: string
) => {
  return Driver.find({ userId });
};

export const getDriverService = async (
  id: string
) => {
  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  return driver;
};

export const updateDriverService = async (
  id: string,
  data: any
) => {
  const currentDriver = await Driver.findById(id);

  if (!currentDriver) {
    throw new Error("Driver not found");
  }

  // Check if another driver already has the same details
  const existingDriver = await Driver.findOne({
    _id: { $ne: id },
    userId: currentDriver.userId,
    name: data.name.trim(),
    mobile: data.mobile.trim(),
    licenseNumber: data.licenseNumber.trim(),
  });

  if (existingDriver) {
    throw new Error("Driver already exists");
  }

  const driver = await Driver.findByIdAndUpdate(
    id,
    {
      name: data.name.trim(),
      mobile: data.mobile.trim(),
      licenseNumber: data.licenseNumber.trim(),
      ...(data.licenseFile && {
        licenseFile: data.licenseFile,
      }),
    },
    {
      new: true,
    }
  );

  return driver;
};

export const deleteDriverService = async (
  id: string
) => {
  const driver = await Driver.findByIdAndDelete(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  return true;
};

export const getDriverDetailsService = async (
  userId: string,
  id: string
) => {
  const driver = await Driver.findOne({
    _id: id,
    userId,
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  return driver;
};