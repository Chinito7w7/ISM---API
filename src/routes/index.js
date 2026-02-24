import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import productRoutes from "../modules/product/product.routes.js";
import moveRoutes from "../modules/movements/movement.routes.js";
import dashboardRoute from "../modules/dashboard/dashboard.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/movements", moveRoutes);
router.use("/dashboard", dashboardRoute);

export default router;
