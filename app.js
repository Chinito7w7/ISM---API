import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./src/routes/index.js";
export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.get("/api/health", (req, res) => {
  res.json({ message: "Api running correctly" });
});
