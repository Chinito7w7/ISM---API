import express from "express";
import { register, login } from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

//prueba de middleware

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ruta protegida",
    user: req.user,
  });
});

export default router;
