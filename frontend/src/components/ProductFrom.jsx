import { useState } from "react";

export default function ProductForm({ onCreated }) {
  // [1] Simpan nilai input dan kondisi pengiriman
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // [2] Jalankan saat formulir dikirim
  async function handleSubmit(event) {
    // Cegah browser memuat ulang halaman
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      // [3] Kirim produk ke backend sebagai JSON
      const response = await fetch("/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku,
          name,
          price: Number(price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan produk");
      }

      // [4] Beri tahu App bahwa produk baru berhasil dibuat
      onCreated(result.data);

      // [5] Kosongkan input setelah berhasil
      setSku("");
      setName("");
      setPrice("");
    } catch (err) {
      // [6] Tampilkan pesan kesalahan
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tambah Produk</h2>

      {/* [7] Input terhubung dengan state */}
      <label>
        SKU — Stock Keeping Unit — kode produk
        <input
          value={sku}
          onChange={(event) => setSku(event.target.value)}
          required
          disabled={saving}
        />
      </label>

      <label>
        Nama produk
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={saving}
        />
      </label>

      <label>
        Harga dalam rupiah
        <input
          type="number"
          min="1"
          max="2147483647"
          step="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
          disabled={saving}
        />
      </label>

      {/* [8] Pesan error dan tombol pengiriman */}
      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Produk"}
      </button>
    </form>
  );
}