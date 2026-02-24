import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getMovements, getLatestMovements } from "./movement.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMovements);
router.get("/latest", getLatestMovements);
export default router;
