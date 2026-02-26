import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getMovements } from "./movement.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMovements);

export default router;
