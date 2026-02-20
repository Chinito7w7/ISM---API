import Product from "./product.model.js";

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
    const products = await Product.find({ owner: req.user.id });
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
