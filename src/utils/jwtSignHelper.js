import jwt from "jsonwebtoken";

export const jwtSignHelper = (user, duration, secret) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    secret,
    {
      expiresIn: duration,
    }
  );
  return token;
};
