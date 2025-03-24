import emailSender from "./emailSender.js";

export const notifySubscribers = (author, subscriber, title, content) => {
  emailSender(
    subscriber.email,
    `New post by ${author.name}`,
    `
        <h2>New Post</h2>
        <p>Title: ${title}</p>
        <p>Content: ${content}</p>
        <p>Author: ${author.name}</p>  `
  );
};
