import User from "../models/user.model.js";
import emailSender from "./emailSender.js";

export const notifySubscribers = async (user, title, content) => {
  const subscribers = await User.findAll({
    where: { id: user.id },
    include: [
      {
        model: User,
        as: "Subscribers",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  console.log("all subscribers " + JSON.stringify(subscribers));
  setImmediate(() => {
    subscribers[0].Subscribers.forEach((subscriber) => {
      try {
        emailSender(
          subscriber.email,
          `New post by ${user.name}`,
          `
              <h2>New Post</h2>
              <p>Title: ${title}</p>
              <p>Content: ${content}</p>
              <p>Author: ${user.name}</p>  `
        );
      } catch (err) {
        console.error("Error sending notification to:", subscriber.email, err);
      }
    });
  });
};
