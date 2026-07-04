import Vehicle from "../models/Vehicle";
import Driver from "../models/Driver";

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
  regDate?: string
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

   const vehicle = await Vehicle.create({
    userId,
    ...vehicleData,
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
  const vehicle = await Vehicle.findOneAndDelete({
    _id: vehicleId,
    userId,
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
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

  return vehicle;
};

export const createManualVehicleService = async (
  userId: string,
  data: any
) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: data.vehicleNumber
      .trim()
      .toUpperCase(),
  });

  if (existingVehicle) {
    throw new Error("Vehicle already exists");
  }

  const vehicle = await Vehicle.create({
    userId,
    vehicleNumber: data.vehicleNumber
      .trim()
      .toUpperCase(),
    model: data.model,
    vehicleType: data.vehicleType,
    isManualEntry: true,
  });

  return vehicle;
};

export const getVehiclesService = async (
  userId: string
) => {
  return Vehicle.find({ userId })
    .select({
      vehicleNumber: 1,
      vehicleType: 1,
      brand: 1,
      model: 1,
      vehicleImage: 1,
      isManualEntry: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 });
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