import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

// Data sementara
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

// Diletakkan di luar route agar nilainya tetap tersimpan
let nextProductId =
  Math.max(0, ...products.map((product) => product.id)) + 1;

// Health
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "stockflow-api",
  });
});

// Daftar produk
app.get("/api/v1/products", (req, res) => {
  return res.status(200).json({
    data: products,
    total: products.length,
  });
});

// Detail produk
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
}); // Route GET detail selesai di sini

// Tambah produk: berdiri sendiri di luar route GET
app.post("/api/v1/products", (req, res) => {
  const { sku, name, price } = req.body ?? {};

  if (typeof sku !== "string" || sku.trim() === "") {
    return res.status(400).json({
      message: "SKU wajib diisi berupa teks",
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Nama produk wajib diisi berupa teks",
    });
  }

  if (!Number.isSafeInteger(price) || price <= 0) {
    return res.status(400).json({
      message: "Harga harus berupa bilangan bulat positif",
    });
  }

  const normalizedSku = sku.trim().toUpperCase();

  const skuExists = products.some(
    (product) => product.sku === normalizedSku
  );

  if (skuExists) {
    return res.status(409).json({
      message: "SKU sudah digunakan",
    });
  }

  const product = {
    id: nextProductId++,
    sku: normalizedSku,
    name: name.trim(),
    price,
  };

  products.push(product);

  return res.status(201).json({
    message: "Produk berhasil ditambahkan",
    data: product,
  });
}); // Route POST selesai di sini

// Handler 404 setelah semua route
app.use((req, res) => {
  return res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

app.listen(port, () => {
  console.log(`StockFlow berjalan di http://localhost:${port}`);
});