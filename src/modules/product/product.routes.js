import express from "express";
import {
  getProductStats,
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getProductStats);
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
