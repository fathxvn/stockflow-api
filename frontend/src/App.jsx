import { useEffect, useState } from "react";
import ProductForm from "./components/ProductFrom";
import TableProduct from "./components/TableProduct";
import ProductDetail from "./components/ProductDetail";

export default function App() {
  // [1] Daftar produk dan status pengambilan data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // [2] Produk yang dipilih untuk edit
  const [editingProduct, setEditingProduct] = useState(null);

  // [3] Data dan status panel detail
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // [4] Status penghapusan produk
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // [5] Ambil daftar produk ketika komponen tampil
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/v1/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar produk");
        }

        const result = await response.json();
        setProducts(result.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    // Batalkan request ketika komponen dilepas
    return () => controller.abort();
  }, []);

  // [6] Tambahkan hasil POST ke daftar
  function handleProductCreated(product) {
    setProducts((previousProducts) => [...previousProducts, product]);
  }

  // [7] Ganti produk lama dengan hasil PUT
  function handleProductUpdated(updatedProduct) {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );

    setEditingProduct(null);
    setDetailProduct(null);
    setDetailError("");
  }

  // [8] Pilih produk untuk mengisi formulir edit
  function handleEditProduct(product) {
    setEditingProduct(product);
    setDetailProduct(null);
    setDetailError("");
  }

  // [9] Hapus produk setelah dikonfirmasi
  async function handleDeleteProduct(product) {
    if (deletingId !== null || detailLoading) return;

    const confirmed = window.confirm(
      `Hapus produk "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/v1/products/${product.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Produk sudah tidak ditemukan. Refresh halaman."
            : "Gagal menghapus produk"
        );
      }

      // Respons 204 tidak memiliki body JSON
      setProducts((previousProducts) =>
        previousProducts.filter((item) => item.id !== product.id)
      );

      // Tutup panel atau form yang memakai produk tersebut
      setDetailProduct((currentProduct) =>
        currentProduct?.id === product.id ? null : currentProduct
      );

      setEditingProduct((currentProduct) =>
        currentProduct?.id === product.id ? null : currentProduct
      );
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // [10] Ambil detail terbaru dari backend
  async function handleViewProduct(product) {
    if (detailLoading || deletingId !== null) return;

    setDetailLoading(true);
    setDetailError("");
    setDetailProduct(null);

    try {
      const response = await fetch(
        `/api/v1/products/${product.id}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil detail produk"
        );
      }

      setDetailProduct(result.data);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  // [11] Tutup panel detail
  function handleCloseDetail() {
    setDetailProduct(null);
    setDetailError("");
  }

  // [12] Tampilan saat mengambil daftar
  if (loading) {
    return (
      <p className="px-4 py-10 text-center text-slate-600">
        Memuat produk...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="px-4 py-10 text-center text-red-600">
        {error}
      </p>
    );
  }

  // [13] Susun halaman dari komponen
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          StockFlow
        </h1>
        <p className="mt-2 text-slate-600">
          Kelola data produk gudang.
        </p>
      </header>

      {/* [14] Form tambah/edit; key mereset form saat pilihan berubah */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm
          key={editingProduct?.id ?? "create"}
          product={editingProduct}
          onCreated={handleProductCreated}
          onUpdated={handleProductUpdated}
          onCancel={() => setEditingProduct(null)}
        />
      </section>

      {/* [15] Status pengambilan detail */}
      {detailLoading && (
        <p role="status" className="text-slate-600">
          Memuat detail produk...
        </p>
      )}

      {detailError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-red-700"
        >
          {detailError}
        </p>
      )}

      {/* [16] Tampilkan panel jika data detail tersedia */}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={handleCloseDetail}
        />
      )}

      {/* [17] Daftar produk dan pesan error penghapusan */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Daftar Produk
        </h2>

        {deleteError && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {deleteError}
          </p>
        )}

        <div className="overflow-x-auto">
          <TableProduct
            products={products}
            onDelete={handleDeleteProduct}
            deletingId={deletingId}
            onEdit={handleEditProduct}
            onView={handleViewProduct}
            detailLoading={detailLoading}
          />
        </div>
      </section>
    </main>
  );
}