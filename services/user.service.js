import User from "../models/user.model.js";
import responseHandler from "../utils/responseHandler.js";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};
export const createUser = async (name, email, password, role) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  delete user.dataValues.password;
  return user;
};

export const findUserByPk = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
 
  return user;
};

export const deleteUser = async (id) => {
  await User.destroy({
    where: {
      id,
    },
  });
};
