import User from "../users/user.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const register = async ({ name, email, password, businessName }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Usuario ya registrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10); //El segundo dato

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    businessName,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Credenciales invalidas");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      businessName: user.businessName,
    },
  };
};

export const authService = { register, login };
