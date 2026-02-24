import { authService } from "./auth.service.js";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const newToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.json({
      user,
      token: newToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verificando el estado de autorización",
    });
  }
};
