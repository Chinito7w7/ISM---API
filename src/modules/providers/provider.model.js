import mongoose from "mongoose";

const { Schema } = mongoose;

const providerSchema = new Schema({
  providerName: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  providerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  providerAddress: {
    type: String,
    required: false,
    unique: false,
  },
});
const Provider = mongoose.model("Provier", providerSchema);
export default Provider;
