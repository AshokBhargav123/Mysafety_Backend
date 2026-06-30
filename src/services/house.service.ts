import crypto from "crypto";
import house from "../models/house";

export const addHouseService = async (
  userId: string,
  data: any
) => {
  const existingHouse = await house.findOne({
    userId,
    houseName: data.houseName.trim(),
    houseNumber: data.houseNumber.trim(),
    apartment: data.apartment.trim(),
  });

  if (existingHouse) {
    throw new Error("House already exists");
  }

  const qrCode = crypto.randomBytes(16).toString("hex");

  return house.create({
    userId,
    houseName: data.houseName.trim(),
    houseNumber: data.houseNumber.trim(),
    apartment: data.apartment.trim(),
    fullAddressUrl: data.fullAddressUrl.trim(),
    qrCode,
  });
};

export const getHousesService = async (
  userId: string
) => {
  return house.find({ userId });
};

export const getHouseService = async (
  id: string
) => {
  const houseData = await house.findById(id);

  if (!houseData) {
    throw new Error("House not found");
  }

  return houseData;
};

export const updateHouseService = async (
  id: string,
  data: any
) => {
  const currentHouse = await house.findById(id);

  if (!currentHouse) {
    throw new Error("House not found");
  }

  const existingHouse = await house.findOne({
    _id: { $ne: id },
    userId: currentHouse.userId,
    houseName: data.houseName.trim(),
    houseNumber: data.houseNumber.trim(),
    apartment: data.apartment.trim(),
  });

  if (existingHouse) {
    throw new Error("House already exists");
  }

  const updatedHouse = await house.findByIdAndUpdate(
    id,
    {
      houseName: data.houseName.trim(),
      houseNumber: data.houseNumber.trim(),
      apartment: data.apartment.trim(),
      fullAddressUrl: data.fullAddressUrl.trim(),
    },
    {
      new: true,
    }
  );

  return updatedHouse;
};

export const deleteHouseService = async (
  id: string
) => {
  const houseData = await house.findByIdAndDelete(id);

  if (!houseData) {
    throw new Error("House not found");
  }

  return true;
};

export const assignHouseMembersService = async (
  houseId: string,
  memberIds: string[]
) => {
  const houseData = await house.findById(houseId);

  if (!houseData) {
    throw new Error("House not found");
  }

  const existingIds = houseData.familyMembers.map((m: any) =>
    m.memberId.toString()
  );

  const newMembers = memberIds
    .filter((id) => !existingIds.includes(id))
    .map((id) => ({
      memberId: id,
    }));

  houseData.familyMembers.push(...newMembers);

  await houseData.save();

  const updatedHouse = await house
    .findById(houseId)
    .populate("familyMembers.memberId", "name mobile");

    console.log(
  JSON.stringify(updatedHouse, null, 2)
);

  return updatedHouse;
};

export const getHouseMembersService = async (
  houseId: string
) => {
  const houseData = await house
    .findById(houseId)
    .populate("familyMembers.memberId", "name mobile");

  if (!houseData) {
    throw new Error("House not found");
  }

  return houseData;
};