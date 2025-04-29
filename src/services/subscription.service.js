import Subscription from "../models/subscription.model.js";
import AppError from "../utils/AppError.js";

export const checkSubscriptionExists = async (userId, authorId) => {
  const subscription = await Subscription.findOne({ userId, authorId });
  if (subscription) {
    throw new AppError(400, "User has already subscribed to this author");
  }
};

export const createSubscription = async (userId, authorId) => {
  return await Subscription.create({ userId, authorId });
};

export const findAllSubscribers = async (authorId) => {
  const subscribers = await Subscription.find({ authorId }).populate(
    "userId",
    "name email"
  );
  const count = subscribers.length;

  return { subscribers, count };
};

export const findAllSubscriptions = async (userId) => {
  return await Subscription.find({ userId }).populate("authorId", "name email");
};

export const unsubscribeAuthor = async (authorId, userId) => {
  await Subscription.deleteOne({ authorId, userId });
};
