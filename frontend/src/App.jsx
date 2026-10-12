import { useEffect, useState } from "react";
import ProductForm from "./components/ProductFrom";

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
  return (
    <main>
      <h1>StockFlow</h1>
      
      {/* [3] hubungkan formulir ke fungsi pembaruan daftar */}
      <ProductForm onCreated={handleProductCreated} />

      <h2>Daftar Produk</h2>

      {products.length === 0 ? (
        <p>Belum ada produk.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Kode Produk</th>
              <th>Nama</th>
              <th>Harga</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>
                  {product.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}