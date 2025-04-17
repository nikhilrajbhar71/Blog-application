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
export const findAllSubscribers = async (author_id) => {
  const subscribers = await Subscription.findAll({
    where: {
      author_id: author_id,
    },
  });
  return subscribers;
};

export const findAllSubscriptions = async (user_id) => {
  const subscriptions = await Subscription.findAll({
    where: { user_id: user_id },
  });
  return subscriptions;
};

export const unsubscribeAuthor = async (author_id, user_id) => {
  await Subscription.destroy({
    where: {
      author_id,
      user_id
    },
  });
};
