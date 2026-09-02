import Vehicle from "../models/Vehicle";
import Driver from "../models/Driver";
import { paginate } from "../utils/pagination";
import {
  uploadFileService,
  getSignedUrlService,
  deleteFileService,
} from "./upload.service";

const fetchVehicleFromThirdParty = async (
  vehicleNumber: string
) => {
  return {
    vehicleNumber,
    vehicleType: "Car" as const,
    brand: "BMW",
    model: "X7",
    variant: "xDrive40d",
    color: "Black",
    fuelType: "Diesel",
    manufacturerDate: "2022",
    registrationDate: "12-03-2022",
    ownerName: "Ashok",
    ownerNumber: "9876543210",
    registrationAuthority: "RTO Bangalore",
    rcStatus: "Active",
    rcExpiry: "12-03-2037",
    insuranceCompany: "Tata AIG",
    policyNumber: "POL123456",
    insuranceExpiry: "12-03-2027",
    pollutionStatus: "Active",
    pollutionExpiry: "12-09-2026",
    engineNumber: "ENG123456",
    chassisNumber: "CHS987654",
    seatingCapacity: 5,
    wheelBase: "2670 mm",
    vehicleClass: "LMV",
  };
};

export const fetchVehicleService = async (
  userId: string,
  vehicleNumber: string,
  regDate?: string,
  file?: Express.Multer.File
) => {

  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: vehicleNumber.trim().toUpperCase(),
  });

  if (existingVehicle) {
    throw new Error("Vehicle already exists");
  }

  // Third-party API call
  // const vehicleData = await fetchVehicleFromThirdParty(vehicleNumber);

  const vehicleData = await fetchVehicleFromThirdParty(
  vehicleNumber
);

let vehicleImage: string | undefined;

if (file) {
  const uploadedFile = await uploadFileService(
    file,
    `vehicles/${userId}`
  );

  vehicleImage = uploadedFile.key;
}

   const vehicle = await Vehicle.create({
    userId,
    ...vehicleData,
    vehicleImage,
    vehicleNumber: vehicleNumber.trim().toUpperCase(),
    registrationDate:
      regDate || vehicleData.registrationDate,
  });

  return vehicle;
};

export const deleteVehicleService = async (
  userId: string,
  vehicleId: string
) => {
  // const vehicle = await Vehicle.findOneAndDelete({
  //   _id: vehicleId,
  //   userId,
  // });

  // if (!vehicle) {
  //   throw new Error("Vehicle not found");
  // }

  // return true;

  const vehicle = await Vehicle.findOne({
  _id: vehicleId,
  userId,
});

if (!vehicle) {
  throw new Error("Vehicle not found");
}

const vehicleImage = vehicle.vehicleImage;

await Vehicle.deleteOne({
  _id: vehicleId,
  userId,
});

if (vehicleImage) {
  try {
    await deleteFileService(vehicleImage);
  } catch (error) {
    console.error(
      "Failed to delete vehicle image from S3:",
      error
    );
  }
}

return true;
};

export const getVehicleDetailsService = async (
  userId: string,
  vehicleId: string
) => {
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    userId,
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const vehicleData = vehicle.toObject();

if (vehicleData.vehicleImage) {
  vehicleData.vehicleImage =
    await getSignedUrlService(
      vehicleData.vehicleImage
    );
}

return vehicleData;

};

export const createManualVehicleService = async (
  userId: string,
  data: any,
  file?: Express.Multer.File
) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: data.vehicleNumber
      .trim()
      .toUpperCase(),
  });

  if (existingVehicle) {
    throw new Error("Vehicle already exists");
  }

  let vehicleImage: string | undefined;

if (file) {
  const uploadedFile = await uploadFileService(
    file,
    `vehicles/${userId}`
  );

  vehicleImage = uploadedFile.key;
}

  const vehicle = await Vehicle.create({
    userId,
    vehicleNumber: data.vehicleNumber
      .trim()
      .toUpperCase(),
    model: data.model,
    vehicleImage,
    vehicleType: data.vehicleType,
    isManualEntry: true,
  });

  return vehicle;
};

export const getVehiclesService = async (
  userId: string,
  page: number,
  limit: number,
  search?: string,
  vehicleType?: string
) => {
  const filter: any = {
    userId,
  };

  // Search
  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    filter.$or = [
      { vehicleNumber: searchRegex },
      { brand: searchRegex },
      { model: searchRegex },
    ];
  }

  // Vehicle type filter
  if (vehicleType) {
    filter.vehicleType = vehicleType;
  }

  // return await paginate(
  //   Vehicle,
  //   filter,
  //   {
  //     page,
  //     limit,

  //     sort: {
  //       createdAt: -1,
  //     },

  //     select:
  //       "vehicleNumber vehicleType brand model vehicleImage isManualEntry createdAt updatedAt",
  //   }
  // );

  const result = await paginate(
  Vehicle,
  filter,
  {
    page,
    limit,

    sort: {
      createdAt: -1,
    },

    select:
      "vehicleNumber vehicleType brand model vehicleImage isManualEntry createdAt updatedAt",
  }
);

result.data = await Promise.all(
  result.data.map(async (vehicle: any) => {
    const vehicleData = vehicle.toObject
      ? vehicle.toObject()
      : vehicle;

    if (vehicleData.vehicleImage) {
      vehicleData.vehicleImage =
        await getSignedUrlService(
          vehicleData.vehicleImage
        );
    }

    return vehicleData;
  })
);

return result;

};

export const assignDriverService = async (
  userId: string,
  vehicleId: string,
  driverId: string
) => {

  // Check vehicle
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    userId,
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  // Check driver
  const driver = await Driver.findById(driverId);

  if (!driver) {
    throw new Error("Driver not found");
  }

  // Assign driver
  vehicle.assignedDriver = driver._id;

  await vehicle.save();

  // Return populated data
  const updatedVehicle = await Vehicle.findById(
    vehicle._id
  ).populate(
    "assignedDriver",
    "name mobile email licenseFile"
  );

  // return updatedVehicle;

 return {
  vehicleId: updatedVehicle?._id,
  userId: updatedVehicle?.userId,
  assignedDriver: {
    _id: (updatedVehicle?.assignedDriver as any)?._id,
    name: (updatedVehicle?.assignedDriver as any)?.name,
    mobile: (updatedVehicle?.assignedDriver as any)?.mobile,
    email: (updatedVehicle?.assignedDriver as any)?.email,
    licenseFile: (updatedVehicle?.assignedDriver as any)?.licenseFile,
  },
  createdAt: updatedVehicle?.createdAt,
  updatedAt: updatedVehicle?.updatedAt,
};
};

export const removeAssignedDriverService = async (
  userId: string,
  vehicleId: string
) => {
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    userId,
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (!vehicle.assignedDriver) {
    throw new Error("No driver assigned");
  }

  vehicle.assignedDriver = null;

  await vehicle.save();

  return {
    message: "Driver unmapped successfully",
  };
};

export const getAssignedDriverService = async (
  userId: string,
  vehicleId: string
) => {
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    userId,
  }).populate(
    "assignedDriver",
    "name mobile email licenseFile"
  );

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (!vehicle.assignedDriver) {
    throw new Error("No driver assigned");
  }

  return {
    vehicleId: vehicle._id,
    userId: vehicle.userId,
    assignedDriver: {
      _id: (vehicle.assignedDriver as any)._id,
      name: (vehicle.assignedDriver as any).name,
      mobile: (vehicle.assignedDriver as any).mobile,
      email: (vehicle.assignedDriver as any).email,
      licenseFile: (vehicle.assignedDriver as any).licenseFile,
    },
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
};