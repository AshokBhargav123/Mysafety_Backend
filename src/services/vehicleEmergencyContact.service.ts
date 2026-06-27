import VehicleEmergencyContact from "../models/VehicleEmergencyContact";

export const addVehicleEmergencyContactService = async (
  userId: string,
  data: any
) => {
  const existingContact =
    await VehicleEmergencyContact.findOne({
      userId,
      email: data.email.trim().toLowerCase(),
      mobile: data.mobile.trim(),
    });

  if (existingContact) {
    throw new Error(
      "Vehicle emergency contact already exists"
    );
  }

  return VehicleEmergencyContact.create({
    userId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    mobile: data.mobile.trim(),
  });
};

export const getVehicleEmergencyContactsService =
  async (userId: string) => {
    return VehicleEmergencyContact.find({
      userId,
    });
  };

export const getVehicleEmergencyContactService =
  async (id: string) => {
    const contact =
      await VehicleEmergencyContact.findById(
        id
      );

    if (!contact) {
      throw new Error(
        "Vehicle emergency contact not found"
      );
    }

    return contact;
  };

export const updateVehicleEmergencyContactService =
  async (
    id: string,
    data: any
  ) => {
    const currentContact =
      await VehicleEmergencyContact.findById(
        id
      );

    if (!currentContact) {
      throw new Error(
        "Vehicle emergency contact not found"
      );
    }

    const existingContact =
      await VehicleEmergencyContact.findOne({
        _id: { $ne: id },
        userId: currentContact.userId,
        email: data.email.trim().toLowerCase(),
        mobile: data.mobile.trim(),
      });

    if (existingContact) {
      throw new Error(
        "Vehicle emergency contact already exists"
      );
    }

    const contact =
      await VehicleEmergencyContact.findByIdAndUpdate(
        id,
        {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          mobile: data.mobile.trim(),
        },
        {
          new: true,
        }
      );

    return contact;
  };

export const deleteVehicleEmergencyContactService =
  async (id: string) => {
    const contact =
      await VehicleEmergencyContact.findByIdAndDelete(
        id
      );

    if (!contact) {
      throw new Error(
        "Vehicle emergency contact not found"
      );
    }

    return true;
  };