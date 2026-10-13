// [1] Terima produk dan fungsi penutup dari App
export default function ProductDetail({ product, onClose }) {
  return (
    <section className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Detail Produk
        </h2>

        {/* [2] Minta App menutup panel */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>

      {/* [3] Daftar pasangan label dan nilai */}
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Kode Produk</dt>
          <dd className="mt-1 font-medium">{product.sku}</dd>
        </div>

        <div>
          <dt className="text-slate-500">Nama</dt>
          <dd className="mt-1 font-medium">{product.name}</dd>
        </div>

        <div>
          <dt className="text-slate-500">Harga</dt>
          <dd className="mt-1 font-medium">
            {product.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Dibuat</dt>
          <dd className="mt-1 font-medium">
            {new Date(product.createdAt).toLocaleString("id-ID")}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Terakhir Diubah</dt>
          <dd className="mt-1 font-medium">
            {new Date(product.updatedAt).toLocaleString("id-ID")}
          </dd>
        </div>
      </dl>
    </section>
  );
}