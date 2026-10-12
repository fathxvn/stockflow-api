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
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* [1] Judul formulir */}
            <h2 className="text-xl font-semibold text-slate-900">
            Tambah Produk
            </h2>

            {/* [2] Kolom tersusun vertikal di HP dan sejajar di layar besar */}
            <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
                Kode Produk
                <input
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                required
                disabled={saving}
                placeholder="BRG-004"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
            </label>

            <label className="block text-sm font-medium text-slate-700">
                Nama Produk
                <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={saving}
                placeholder="Keyboard Wireless"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
            </label>

            <label className="block text-sm font-medium text-slate-700">
                Harga dalam Rupiah
                <input
                type="number"
                min="1"
                max="2147483647"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                disabled={saving}
                placeholder="175000"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
            </label>
            </div>

            {/* [3] Pesan kegagalan */}
            {error && (
            <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
                {error}
            </p>
            )}

            {/* [4] Tombol pengiriman */}
            <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {saving ? "Menyimpan..." : "Simpan Produk"}
            </button>
        </form>
    );
}