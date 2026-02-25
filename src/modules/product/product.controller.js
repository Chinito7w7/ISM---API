import Product from "./product.model.js";
import Movement from "../movements/movement.model.js";
import mongoose from "mongoose";
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      owner: req.user.id,
    });

    const savedProduct = await product.save();

    //Registrar movimiento
    await Movement.create({
      product: savedProduct._id,
      owner: req.user.id,
      type: "CREATE",
      quantity: savedProduct.stock,
      previousStock: 0,
      newStock: savedProduct.stock,
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      product: savedProduct,
    });
  } catch (error) {
    // Si el error es por duplicado (Código 11000)

    //TODO EVITAR DUPLICACION DE PRODUCTOS
    // if (error.code === 11000) {
    //   return res.status(400).json({
    //     message: "Ya existe un producto con ese nombre",
    //   });
    // }
    console.error("Error al crear producto:", error);
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

// export const getProducts = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const skip = (page - 1) * limit;

//     const products = await Product.find({ owner: req.user.id })
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Error al buscar productos" });
//   }
// };
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ owner: req.user.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments({ owner: req.user.id }),
    ]);

    res.json({
      products,
      total,
      page,
    });
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
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const previousStock = product.stock;

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    if (req.body.stock !== undefined) {
      const newStock = updatedProduct.stock;

      if (previousStock !== newStock) {
        await Movement.create({
          product: updatedProduct._id,
          owner: req.user.id,
          type: newStock > previousStock ? "IN" : "OUT",
          quantity: Math.abs(newStock - previousStock),
          previousStock,
          newStock,
        });
      }
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

    await Movement.create({
      product: product._id,
      owner: req.user.id,
      type: "DELETE",
      quantity: product.stock,
      previousStock: product.stock,
      newStock: 0,
    });

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
    const lowStockProducts = await Product.find({
      owner: ownerId,
      stock: { $lte: 5 },
    })
      .sort({ stock: 1 })
      .limit(3)
      .select("name stock");

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
