import { useEffect, useState } from "react";
import ProductForm from "./components/ProductFrom";
import TableProduct from "./components/TableProduct";

export default function App() {
  // [1] Data produk dan status pengambilan data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // [2] Status penghapusan produk
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // [3] Ambil produk ketika komponen tampil
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

    return () => controller.abort();
  }, []);

  // [4] Tambahkan produk baru ke tampilan
  function handleProductCreated(product) {
    setProducts((previousProducts) => [...previousProducts, product]);
  }

  // [5] Hapus produk setelah dikonfirmasi
  async function handleDeleteProduct(product) {
    if (deletingId !== null) return;

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

      // Respons berhasil tidak punya body; langsung perbarui state
      setProducts((previousProducts) =>
        previousProducts.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // [6] Tampilan saat memuat atau gagal mengambil data
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

  // [7] Halaman produk
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

      {/* [8] Formulir tambah produk */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm onCreated={handleProductCreated} />
      </section>

      {/* [9] Daftar produk dan pesan penghapusan */}
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
          />
        </div>
      </section>
    </main>
  );
}