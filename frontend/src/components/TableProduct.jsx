// [1] Terima daftar produk dari App
export default function TableProduct({ products }) {
  // [2] Tampilan daftar kosong
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Belum ada produk. Tambahkan melalui formulir di atas.
      </p>
    );
  }

  // [3] Tabel daftar produk
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
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {/* [4] Satu baris untuk setiap produk */}
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}