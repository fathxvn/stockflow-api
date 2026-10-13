import { useState } from "react";

export default function ProductForm({
  product,
  onCreated,
  onUpdated,
  onCancel,
}) {
  // [1] Isi input dari produk terpilih; kosong untuk mode tambah
  const [sku, setSku] = useState(product?.sku ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(
    product ? String(product.price) : ""
  );

  // [2] Status pengiriman dan pesan error
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // [3] Tentukan mode berdasarkan produk dari App
  const isEditing = product != null;

  async function handleSubmit(event) {
    // [4] Cegah halaman dimuat ulang
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      // [5] Edit memakai PUT, tambah memakai POST
      const url = isEditing
        ? `/api/v1/products/${product.id}`
        : "/api/v1/products";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
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

      // [6] Pertahankan input jika backend menolak request
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan produk");
      }

      // [7] Kirim hasil ke fungsi yang diberikan App
      if (isEditing) {
        onUpdated(result.data);
      } else {
        onCreated(result.data);

        setSku("");
        setName("");
        setPrice("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* [8] Judul sesuai mode formulir */}
      <h2 className="text-xl font-semibold text-slate-900">
        {isEditing ? "Edit Produk" : "Tambah Produk"}
      </h2>

      {/* [9] Input dikendalikan oleh state */}
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

      {/* [10] Pesan kegagalan */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* [11] Tombol simpan dan batal */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Menyimpan..."
            : isEditing
              ? "Simpan Perubahan"
              : "Simpan Produk"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}