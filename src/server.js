import express from "express";
import productRoutes from "./routes/product.routes.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "stockflow-api",
  });
});

app.use("/api/v1/products", productRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

app.listen(port, () => {
  console.log(`StockFlow berjalan di http://localhost:${port}`);
});