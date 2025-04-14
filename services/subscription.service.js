import Subscription from "../models/subscription.model.js";

export const checkSubscriptionExists = async (user_id, author_id) => {
  const subscription = await Subscription.findOne({
    where: { user_id, author_id },
  });
  if (subscription) {
    throw new AppError(400, "User has already subscribed to this author");
  }
};

export const createSubscription = async (user_id, author_id) => {
  return await Subscription.create({ user_id, author_id });
};
