// [1] Gunakan penghubung database yang sudah dibuat
import { prisma } from "../lib/prisma.js";

// [2] Ambil daftar produk dari PostgreSQL
export async function getProducts(req, res) {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return res.status(200).json({
    data: products,
    total: products.length,
  });
}

// [3] Ambil detail produk berdasarkan ID — Identifier
export async function getProductById(req, res) {
  const id = Number(req.params.id);

  // ID memakai tipe Int PostgreSQL: bilangan bulat 32-bit
  if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({
      message: "ID produk harus bilangan bulat positif maksimal 2147483647",
    });
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({
      message: "Produk tidak ditemukan",
    });
  }

  return res.status(200).json({
    data: product,
  });
}

// [4] Validasi dan simpan produk baru
export async function createProduct(req, res) {
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

  // Harga harus sesuai batas tipe Int di PostgreSQL
  if (
    !Number.isSafeInteger(price) ||
    price <= 0 ||
    price > 2147483647
  ) {
    return res.status(400).json({
      message: "Harga harus bilangan bulat positif maksimal 2147483647",
    });
  }

  try {
    // [5] Database membuat ID dan menyimpan produk
    const product = await prisma.product.create({
      data: {
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        price,
      },
    });

    return res.status(201).json({
      message: "Produk berhasil ditambahkan",
      data: product,
    });
  } catch (error) {
    // [6] P2002: nilai melanggar aturan unique, yaitu SKU duplikat
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "SKU sudah digunakan",
      });
    }

    // [7] Teruskan error lain ke penanganan error Express
    throw error;
  }
}

//edit produk berdasarkan ID 
export async function updateProduct(req, res) {
  const id = Number(req.params.id);
  const { sku, name, price } = req.body ?? {};

  //validasi ID sesui batas tipe int PostgreSQL
  if (!Number.isSafeInteger(id) || id <= 0 > 2147483647) {
    return res.status(400).json({
      message: "ID produk tidak valid",
    });
  }

  //validasi SKU -- Stock Keeping Unit -- Kode produk
  if (typeof sku !== "string" || sku.trim() === ""){
    return res.status(400).json({
      message: "SKU wajib diisi berupa teks",
    });
  }
  //validasi nama

  if(typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Nama porduk wajib diisi berupa teks",
    });
  }

  //validasi harga dalam rupiah utuh
  if (
    !Number.isSafeInteger(price) || 
    price <= 0 || 
    price >  2147483647
  ) {
    return res.status(400).json({
      message: "harga harus bilangan bulat positif maksimal  2147483647",
    });
  }

  try {
    // cari produk berdasarkan ID dan ubah datanya 
    const product = await prisma.product.update({
      where: { id },
      data: {
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        price,
      },
    });

    //kirim product setelah perubahan 
    return res.status(400).json({
      message: "Produk berhasil diubah",
    });
  } catch (error) {
    //product yang ingin diubah tidak di temukan 
    if(error.code === "P2025") {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }
    //sku sudah digunakkan oleh produk lain  
    if(error.code === "P2002") {
      return res.status(409).json({
        message: "SKU sudah digunakan",
      });
    }

    //teruskan error lain ke handler error
    throw error;
  }
}