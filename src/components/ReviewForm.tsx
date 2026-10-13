"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Upload, CheckCircle2, MessageSquarePlus } from "lucide-react";

type ProductOption = {
  id: string;
  name: string;
};

export default function ReviewForm({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [photo, setPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      alert("Ukuran foto maksimal 1MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setPhoto(data.url);
      } else {
        alert(data.error || "Gagal mengupload foto");
      }
    } catch {
      alert("Gagal mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          orderNumber,
          productId,
          rating,
          reviewText,
          photo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirim ulasan");
      }

      setSubmitted(true);
      setCustomerName("");
      setOrderNumber("");
      setReviewText("");
      setPhoto("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center">
        <MessageSquarePlus className="w-5 h-5 mr-2 text-amber-600" />
        Tulis Ulasan Anda
      </h3>
      <p className="text-xs text-gray-500 mb-6">
        Sudah pernah memesan kue di Sweet Moments? Bagikan pengalaman Anda di bawah ini!
      </p>

      {submitted && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 text-green-600" />
          Ulasan Anda berhasil ditambahkan! Terima kasih.
        </div>
      )}

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Anda *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Contoh: Rina Putri"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nomor Pesanan (Opsional - Untuk Badge Terverifikasi)
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Contoh: ORD-123456-789"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Kue yang Dibeli *
          </label>
          <select
            required
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-amber-500 focus:border-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Rating Kepuasan *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300 hover:text-amber-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ceritakan Pengalaman Anda *
          </label>
          <textarea
            rows={3}
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Kuenya enak banget, manisnya pas dan pengiriman tepat waktu..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Foto Kue (Opsional, Maks 1MB)
          </label>
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer inline-flex items-center px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200">
              <Upload className="w-4 h-4 mr-1.5" />
              {uploading ? "Mengupload..." : photo ? "Ganti Foto" : "Upload Foto"}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {photo && (
              <span className="text-xs text-green-600 font-medium">✓ Foto siap dilampirkan</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          {submitting ? "Mengirim..." : "Kirim Ulasan"}
        </button>
      </form>
    </div>
  );
}
