import Product from "./product.model.js";
import mongoose from "mongoose";
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      owner: req.user.id,
    });

    const savedProduct = await product.save();
    res.status(201).json({
      message: "Producto creado exitosamente",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find({ owner: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar productos" });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      req.body,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al borrar el producto",
    });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const totalProducts = await Product.countDocuments({ owner: ownerId });

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const totalStock = await Product.aggregate([
      { $match: { owner: ownerObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$stock" },
        },
      },
    ]);
    const lowStockProducts = await Product.countDocuments({
      owner: ownerId,
      stock: { $lte: 5 },
    }).select("name stock");

    const lastProductCreated = await Product.findOne({ owner: ownerId })
      .sort({ createdAt: -1 })
      .select("name stock createdAt");

    const lastProductUpdated = await Product.findOne({ owner: ownerId })
      .sort({ updatedAt: -1 })
      .select("name stock updatedAt");

    res.json({
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      lowStockProducts,
      lastProductCreated,
      lastProductUpdated,
    });
  } catch (error) {
    res.json({ message: "Error al devolver las estadisticas" });
  }
};
