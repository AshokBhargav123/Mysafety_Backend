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

  // return user;
  return {
  _id: user._id,
  mobile: user.mobile,
  name: user.name,
  email: user.email,
  language: user.language,
  address: user.address,
  onboardingCompleted: user.onboardingCompleted,
  userId: user.userId,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
};
};