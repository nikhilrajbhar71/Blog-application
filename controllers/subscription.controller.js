import Subscription from "../models/subscription.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";

import { findUserByPk } from "../services/user.service.js";
import { checkSubscriptionExists, createSubscription } from "../services/subscription.service.js";
export const subscribe = async (req, res, next) => {
  try {
    const { author_id } = req.params;
    const user_id = req.user.id;

    if (author_id == user_id) {
      throw new AppError(400, "User can't subscribe to himself");
    }

    const user = await findUserByPk(author_id);
    if (!user || user.role !== "author") {
      throw new AppError(403, "User is not an author");
    }

    await checkSubscriptionExists(user_id, author_id);

    await createSubscription(user_id, author_id);

    return responseHandler(res, 200, "Subscription created successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getsubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscription.findAll({
      where: {
        author_id: req.user.id,
      },
    });
    let count = subscribers.length;
    responseHandler(res, 200, "Subscribers fetched successfully", {
      subscribers,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const getsubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.user.id },
    });

    responseHandler(res, 200, "Subscriptions fetched successfully", {
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await Subscription.destroy({
      where: {
        author_id: req.params.id,
        user_id: req.user.id,
      },
    });

    responseHandler(res, 200, "unsubscribed successfully", {});
  } catch (error) {
    next(error);
  }
};
