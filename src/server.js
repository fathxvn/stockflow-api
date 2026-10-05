import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "stockflow-api",
  });
});

const products = [
  {
    id: 1,
    sku: "BRG-001",
    name: "Keyboard",
    price: 150000,
  },
  {
    id: 2,
    sku: "BRG-002",
    name: "Mouse",
    price: 75000,
  },
];

// Mengambil semua produk
app.get("/api/v1/products", (req, res) => {
  res.status(200).json({
    data: products,
    total: products.length,
  });
});

// Mengambil satu produk berdasarkan ID
app.get("/api/v1/products/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID produk harus berupa bilangan bulat positif",
    });
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Produk tidak ditemukan",
    });
  }

  return res.status(200).json({
    data: product,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

app.listen(port, () => {
  console.log(`StockFlow berjalan di http://localhost:${port}`);
});
