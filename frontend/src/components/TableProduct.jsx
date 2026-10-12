// [1] Terima daftar produk dari App melalui prop
export default function TableProduct({ products }) {
  // [2] Tampilkan pesan kalau daftar kosong
  if (products.length === 0) {
    return <p>Belum ada produk.</p>;
  }

  // [3] Tampilkan daftar dalam tabel
  return (
    <table>
      <thead>
        <tr>
          <th>Kode Produk</th>
          <th>Nama</th>
          <th>Harga</th>
        </tr>
      </thead>

      <tbody>
        {/* [4] Ubah setiap produk menjadi satu baris */}
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
  );
}