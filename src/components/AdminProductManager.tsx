"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Upload, Check, PackageCheck, PackageX } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string | null;
  status: string;
};

export default function AdminProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Ulang Tahun",
    description: "",
    price: "",
    image: "",
    status: "available",
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Ulang Tahun",
      description: "",
      price: "",
      image: "",
      status: "available",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      image: product.image || "",
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 1MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || "Gagal mengupload gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingProduct ? "PATCH" : "POST";
      const payload = editingProduct
        ? { id: editingProduct.id, ...formData, price: Number(formData.price) }
        : { ...formData, price: Number(formData.price) };

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
        } else {
          setProducts((prev) => [data.product, ...prev]);
        }
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert(data.message || "Gagal menyimpan produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStatus = product.status === "available" ? "out_of_stock" : "available";
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, status: newStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Yakin ingin menghapus kue "${product.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        router.refresh();
      } else {
        alert("Gagal menghapus produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Katalog Kue</h2>
          <p className="text-sm text-gray-500">Tambah kue baru, ubah harga, atau atur ketersediaan stok.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Kue Baru
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-100">
              <th className="pb-3 font-medium">Kue</th>
              <th className="pb-3 font-medium">Kategori</th>
              <th className="pb-3 font-medium">Harga</th>
              <th className="pb-3 font-medium">Status Stok</th>
              <th className="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-4 pr-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-600">{product.category}</td>
                <td className="py-4 text-sm font-semibold text-amber-800">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>
                <td className="py-4 text-sm">
                  <button
                    onClick={() => handleToggleStock(product)}
                    title="Klik untuk ubah status stok"
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      product.status === "available"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {product.status === "available" ? (
                      <>
                        <PackageCheck className="w-3.5 h-3.5 mr-1" /> Tersedia
                      </>
                    ) : (
                      <>
                        <PackageX className="w-3.5 h-3.5 mr-1" /> Habis
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 text-sm text-right space-x-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors inline-flex items-center"
                    title="Edit Kue"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center"
                    title="Hapus Kue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit Kue */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Kue" : "Tambah Kue Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kue *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Classic Red Velvet Cake"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ulang Tahun / Pernikahan / Slice"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="250000"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                >
                  <option value="available">Tersedia (Available)</option>
                  <option value="out_of_stock">Habis Terjual (Out of Stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Kue (URL atau Upload Maks 1MB)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... atau upload file di samping"
                    className="flex-1 px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                  />
                  <label className="cursor-pointer inline-flex items-center px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200">
                    <Upload className="w-4 h-4 mr-1" />
                    {uploading ? "Upload..." : "Upload"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kue *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan rasa, tekstur, dan keunggulan kue ini..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="inline-flex items-center px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  {loading ? "Menyimpan..." : "Simpan Kue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
