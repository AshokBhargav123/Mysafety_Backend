import User from "../models/User";

export const completeProfileService = async (
  userId: string,
  data: any
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = data.name;
  user.email = data.email;
  user.language = data.language;

  if (data.profileImage) {
    user.profileImage = data.profileImage;
  }


  user.address = {
    fullAddress: data.address?.fullAddress,
    pincode: data.address?.pincode,
    landmark: data.address?.landmark,
    latitude: data.address?.latitude,
    longitude: data.address?.longitude,
  };

  user.onboardingCompleted = true;

  await user.save();

  return user;
};