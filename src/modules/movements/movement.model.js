import mongoose from "mongoose";
const { Schema } = mongoose;

const movementSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT", "CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    previousStock: Number,
    newStock: Number,
  },
  { timestamps: true },
);

const Movement = mongoose.model("Movement", movementSchema);
export default Movement;
