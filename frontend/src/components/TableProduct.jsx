// [1] Terima data dan fungsi dari App melalui props
export default function TableProduct({
  products,
  onDelete,
  deletingId,
  onEdit,
  onView,
  detailLoading,
}) {
  // [2] Nonaktifkan aksi selama request detail atau hapus berlangsung
  const actionPending = detailLoading || deletingId !== null;

  // [3] Tampilan daftar kosong
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Belum ada produk. Tambahkan melalui formulir di atas.
      </p>
    );
  }

  // [4] Tabel produk
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
        <tr>
          <th scope="col" className="px-4 py-3 font-semibold">
            Kode Produk
          </th>
          <th scope="col" className="px-4 py-3 font-semibold">
            Nama
          </th>
          <th scope="col" className="px-4 py-3 text-right font-semibold">
            Harga
          </th>
          <th scope="col" className="px-4 py-3 text-right font-semibold">
            Aksi
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {/* [5] Buat satu baris untuk setiap produk */}
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-slate-50">
            <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-600">
              {product.sku}
            </td>

            <td className="px-4 py-4 font-medium text-slate-900">
              {product.name}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums text-slate-700">
              {product.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </td>

            {/* [6] Setiap tombol mengirim produk baris ini ke App */}
            <td className="px-4 py-4">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onView(product)}
                  disabled={actionPending}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Detail
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  disabled={actionPending}
                  className="rounded-lg border border-blue-200 px-3 py-1.5 font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  disabled={actionPending}
                  className="rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === product.id ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}