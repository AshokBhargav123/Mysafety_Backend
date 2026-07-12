import PredefinedMessage from "../models/PredefinedMessage";

export const addPredefinedMessageService = async (
  userId: string,
  body: any
) => {
  const { message } = body;

  const existing = await PredefinedMessage.findOne({
    userId,
    message: message.trim(),
  });

  if (existing) {
    throw new Error("Message already exists");
  }

  return await PredefinedMessage.create({
    userId,
    message,
  });
};

export const getPredefinedMessagesService = async (
  userId: string
) => {
  return await PredefinedMessage.find({ userId }).sort({
    createdAt: -1,
  });
};

export const getPredefinedMessageByIdService = async (
  userId: string,
  id: string
) => {
  const message = await PredefinedMessage.findOne({
    _id: id,
    userId,
  });

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
};

export const updatePredefinedMessageService = async (
  userId: string,
  id: string,
  body: any
) => {
  const { message } = body;

  const existing = await PredefinedMessage.findOne({
    _id: { $ne: id },
    userId,
    message: message.trim(),
  });

  if (existing) {
    throw new Error("Message already exists");
  }

  const updated = await PredefinedMessage.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      message,
    },
    {
      new: true,
    }
  );

  if (!updated) {
    throw new Error("Message not found");
  }

  return updated;
};

export const deletePredefinedMessageService = async (
  userId: string,
  id: string
) => {
  const deleted = await PredefinedMessage.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deleted) {
    throw new Error("Message not found");
  }

  return;
};