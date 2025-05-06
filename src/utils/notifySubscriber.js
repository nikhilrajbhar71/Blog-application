import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import emailSender from "./emailSender.js";

export const notifySubscribers = async (user, title, content) => {
  // Find all subscribers to the given author (user)
  const subscriptions = await Subscription.find({
    authorId: user._id,
  }).populate("userId", "name email");

  subscriptions.forEach(({ userId: subscriber }) => {
    try {
      emailSender(
        subscriber.email,
        `New post by ${user.name}`,
        `
          <h2>New Post</h2>
          <p>Title: ${title}</p>
          <p>Content: ${content}</p>
          <p>Author: ${user.name}</p>  
        `
      );
    } catch (err) {
      console.error("Error sending notification to:", subscriber.email, err);
    }
  });
};
