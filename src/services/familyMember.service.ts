import User from "../models/User";
import FamilyMember from "../models/FamilyMember";

// export const addFamilyMemberService = async (
//   ownerId: string,
//   mobile: string
// ) => {

//      console.log("ownerId:", ownerId);
//   console.log("mobile:", mobile);

//   const member = await User.findOne({
//     mobile,
//   });

//     console.log("member:", member);

//   if (!member) {
//     throw new Error(
//       "User not found with this mobile number"
//     );
//   }

//   if (
//     ownerId === member._id.toString()
//   ) {
//     throw new Error(
//       "You cannot add yourself"
//     );
//   }

//   const exists =
//     await FamilyMember.findOne({
//       ownerId,
//       memberId: member._id,
//     });

//   if (exists) {
//     throw new Error(
//       "Family member already added"
//     );
//   }

//   const familyMember =
//     await FamilyMember.create({
//       ownerId,
//       memberId: member._id,
//     });

//   return familyMember;
// };

export const addFamilyMemberService = async (
  ownerId: string,
  mobile: string
) => {
  const owner = await User.findById(ownerId);

  const member = await User.findOne({
    mobile,
  });

  if (!member) {
    throw new Error(
      "User not found with this mobile number"
    );
  }

  if (
    ownerId === member._id.toString()
  ) {
    throw new Error(
      "You cannot add yourself"
    );
  }

  const exists =
    await FamilyMember.findOne({
      ownerId,
      memberId: member._id,
    });

  if (exists) {
    throw new Error(
      "Family member already added"
    );
  }

  const familyMember =
    await FamilyMember.create({
      ownerId,
      memberId: member._id,
    });

  return {
    familyMemberId: familyMember._id,

    owner: {
      id: owner?._id,
      name: owner?.name,
      mobile: owner?.mobile,
      userId: owner?.userId,
    },

    member: {
      id: member._id,
      name: member.name,
      mobile: member.mobile,
      userId: member.userId,
    },
  };
};

export const getFamilyMembersService =
  async (ownerId: string) => {
    return FamilyMember.find({
      ownerId,
    }).populate(
      "memberId",
      "name mobile address"
    );
  };

  export const updateFamilyMemberService =
  async (
    ownerId: string,
    memberId: string,
    mobile: string
  ) => {
    const newMember =
      await User.findOne({
        mobile,
      });

    if (!newMember) {
      throw new Error(
        "User not found with this mobile number"
      );
    }

    if (
      ownerId ===
      newMember._id.toString()
    ) {
      throw new Error(
        "You cannot add yourself"
      );
    }

    const updated =
      await FamilyMember.findOneAndUpdate(
        {
          ownerId,
          memberId,
        },
        {
          memberId: newMember._id,
        },
        {
          new: true,
        }
      )
        .populate(
          "ownerId",
          "name mobile userId"
        )
        .populate(
          "memberId",
          "name mobile userId"
        );

    if (!updated) {
      throw new Error(
        "Family member not found"
      );
    }

    return updated;
  };

export const removeFamilyMemberService =
  async (
    ownerId: string,
    memberId: string
  ) => {
    await FamilyMember.findOneAndDelete({
      ownerId,
      memberId,
    });

    return true;
  };