import Movement from "./movement.model.js";

export const getMovements = async (req, res) => {
  try {
    const movements = await Movement.find({
      owner: req.user.id,
    })
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json(movements);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo movimientos",
    });
  }
};
