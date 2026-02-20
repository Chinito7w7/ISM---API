import Product from "./product.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      owner: req.user.id,
    });

    const savedProduct = await product.save();
    res
      .status(201)
      .json({ message: "Producto creado exitosamente" }, savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el product" });
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
