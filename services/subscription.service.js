import Subscription from "../models/subscription.model.js";
import AppError from "../utils/AppError.js";

export const checkSubscriptionExists = async (userId, authorId) => {
  const subscription = await Subscription.findOne({
    where: { userId, authorId },
  });
  if (subscription) {
    throw new AppError(400, "User has already subscribed to this author");
  }
};

export const createSubscription = async (userId, authorId) => {
  return await Subscription.create({ userId, authorId });
};
export const findAllSubscribers = async (authorId) => {
  const subscribers = await Subscription.findAll({
    where: { authorId },
  });

  const count = subscribers.length;

  return { subscribers, count }; 
};

export const findAllSubscriptions = async (userId) => {
  const subscriptions = await Subscription.findAll({
    where: { userId },
  });
  return subscriptions;
};

export const unsubscribeAuthor = async (authorId, userId) => {
  await Subscription.destroy({
    where: {
      authorId,
      userId,
    },
  });
};
