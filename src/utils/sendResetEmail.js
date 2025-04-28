import emailSender from "./emailSender.js";

export const sendResetEmail = async (email, token) => {
  try {
    const resetLink = `http://localhost:5000/api/users/reset-password/${token}`;

    emailSender(
      email,
      `Reset Password`,
      `Here is you resent link ${resetLink}
        `
    );
  } catch (err) {
    console.error("Error sending notification to:", subscriber.email, err);
  }
};
