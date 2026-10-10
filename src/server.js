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

// [1] Tangani error yang diteruskan oleh route/controller
app.use((error, req, res, next) => {
  // Detail error untuk debugging di terminal
  console.error(error);

  // Jangan kirim detail internal database ke client
  return res.status(500).json({
    message: "Terjadi kesalahan pada server",
  });
});

app.listen(port, () => {
  console.log(`StockFlow berjalan di http://localhost:${port}`);
});