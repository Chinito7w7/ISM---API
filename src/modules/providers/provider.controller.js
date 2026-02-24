import mongoose from "mongoose";
import Provider from "./provider.model";

export const createProvider = async (req, res) => {
  try {
    const provider = new Provider({
      ...req.body,
      owner: req.user.id,
    });

    const savedProvider = await provider.save();

    res.status(201).json({
      message: "Proveedor creado exitosamente",
      provider: savedProvider,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.find({
      _id: req.params.id,
      owner: req.user.i,
    });
    if (!provider)
      return res.status(404).json({ message: "Producto no encontrado" });

    const updatedProvider = await provider.save();
    res.json(updatedProvider);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el proveedor" });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!provider)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {}
};

export const getProviders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const providers = await Provider.find({ owner: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar productos" });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo el proveedor" });
  }
};
