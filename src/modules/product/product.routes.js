import express from "express";
import {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "./product.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.put("/:id", updateProduct);

export default router;
