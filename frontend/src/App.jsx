import { useEffect, useState } from "react";
import ProductForm from "./components/ProductFrom";
import TableProduct from "./components/TableProduct";
export default function App() {
  // [1] State: data yang digunakan untuk menampilkan halaman
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // [2] Ambil produk saat komponen tampil
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        // [3] Kirim GET melalui proxy Vite
        const response = await fetch("/api/v1/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar produk");
        }

        const result = await response.json();

        // [4] Simpan produk; React memperbarui tampilan
        setProducts(result.data);
      } catch (err) {
        // [5] Abaikan request yang dibatalkan saat komponen dilepas
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

    // [6] Batalkan request ketika komponen dilepas
    return () => controller.abort();
  }, []);

  // [1] Tambahkan produk baru ke daftar tampilan
  function handleProductCreated(product) {
    setProducts((previosProducts) => [...previosProducts, product]);
  }

  // [7] Tampilkan kondisi menunggu atau gagal
  if (loading) return <p>Memuat produk...</p>;
  if (error) return <p role="alert">{error}</p>;

  // [8] Tampilkan data dari database
// [8] Layout halaman dengan Tailwind
return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* [9] Judul halaman */}
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          StockFlow
        </h1>
        <p className="mt-2 text-slate-600">
          Kelola data produk gudang.
        </p>
      </header>

      {/* [10] Panel formulir */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm onCreated={handleProductCreated} />
      </section>

      {/* [11] Panel daftar produk */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Daftar Produk
        </h2>

        <div className="overflow-x-auto">
          <TableProduct products={products} />
        </div>
      </section>
    </main>
  );
}