import Product from "../product/product.model.js";
import Movement from "../movements/movement.model.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    // Total productos
    const totalProducts = await Product.countDocuments({
      owner: ownerId,
    });

    // Total stock
    const totalStockResult = await Product.aggregate([
      { $match: { owner: ownerObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$stock" },
        },
      },
    ]);

    const totalStock = totalStockResult[0]?.total || 0;

    // Valor total inventario
    const inventoryValueResult = await Product.aggregate([
      { $match: { owner: ownerObjectId } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$price", "$stock"] },
          },
        },
      },
    ]);

    const inventoryValue = inventoryValueResult[0]?.total || 0;

    // Bajo stock (3 productos)
    const lowStockProducts = await Product.find({
      owner: ownerId,
      stock: { $lte: 5 },
    })
      .sort({ stock: 1 })
      .limit(3)
      .select("name stock");

    // Últimos movimientos
    const latestMovementsRaw = await Movement.find({
      owner: ownerId,
    })
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestMovements = latestMovementsRaw.map((move) => ({
      _id: move._id,
      productName:
        move.product?.name ||
        move.productSnapshot?.name ||
        "Producto eliminado",
      type: move.type,
      quantity: move.quantity,
      previousStock: move.previousStock,
      newStock: move.newStock,
      createdAt: move.createdAt,
    }));

    // Movimientos de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMovements = await Movement.countDocuments({
      owner: ownerId,
      createdAt: { $gte: today },
    });

    res.json({
      stats: {
        totalProducts,
        totalStock,
        inventoryValue,
        todayMovements,
      },
      lowStockProducts,
      latestMovements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo dashboard",
    });
  }
};
