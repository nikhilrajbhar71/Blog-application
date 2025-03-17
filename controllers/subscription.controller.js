import Subscription from "../models/subscription.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";

export const subscribe = async (req, res, next) => {
  try {
    const { author_id } = req.params;
    const user_id = req.user.id;

    if (author_id == user_id) {
      throw new AppError(400, "User can't subscribe to himself");
    }
    const subscription = await Subscription.findOne({
      where: { user_id: user_id, author_id: author_id },
    });
    console.log("test " + JSON.stringify(subscription));
    if (subscription) {
      throw new AppError(400, "User has already subscribed to this author");
    }
    const newSubscription = await Subscription.create({
      user_id: user_id,
      author_id: author_id,
    });
    responseHandler(res, 200, "Subscription created successfully", {
      newSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getsubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscription.findAll({
      author_id: req.user.id,
    });
    responseHandler(res, 200, "Subscribers fetched successfully", {
        subscribers,
    });
  } catch (error) {
    next(error);
  }
};

export const getsubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAll({
      user_id: req.user.id,
    });
    responseHandler(res, 200, "Subscriptions fetched successfully", {
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
