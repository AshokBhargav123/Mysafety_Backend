import LostFound from "../models/LostFound";

export const addLostFoundItemService = async (
  userId: string,
  body: any,
  file: Express.Multer.File
) => {

  const {
    itemName,
    description,
    category,
  } = body;

  const existing = await LostFound.findOne({
    userId,
    itemName: itemName.trim(),
  });

  if (existing) {
    throw new Error("Item already exists");
  }

  const qrCode = `LF${Date.now()}`;

  const item = await LostFound.create({
    userId,
    itemName,
    description,
    category,
    itemPhoto: `/uploads/lost-found/${file.filename}`,
    qrCode,
  });

  return item;
};

export const getLostFoundItemsService = async (
  userId: string
) => {
  return await LostFound.find({ userId })
    .sort({ createdAt: -1 });
};

export const getLostFoundItemByIdService = async (
  userId: string,
  id: string
) => {
  const item = await LostFound.findOne({
    _id: id,
    userId,
  });

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

export const updateLostFoundItemService = async (
  userId: string,
  id: string,
  body: any,
  file?: Express.Multer.File
) => {
  const {
    itemName,
    description,
    category,
  } = body;

  const item = await LostFound.findOne({
    _id: id,
    userId,
  });

  if (!item) {
    throw new Error("Item not found");
  }

  if (itemName) {
    item.itemName = itemName;
  }

  if (description) {
    item.description = description;
  }

  if (category) {
    item.category = category;
  }

  if (file) {
    item.itemPhoto = `/uploads/lost-found/${file.filename}`;
  }

  await item.save();

  return item;
};

export const deleteLostFoundItemService = async (
  userId: string,
  id: string
) => {
  const item = await LostFound.findOne({
    _id: id,
    userId,
  });

  if (!item) {
    throw new Error("Item not found");
  }

  await LostFound.findByIdAndDelete(id);

  return;
};