"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, CreditCard, User, MessageCircle, ArrowLeft, ShoppingBag } from "lucide-react";

type ProductData = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string | null;
  status: string;
};

const ADMIN_WHATSAPP = "6281234567890"; // Nomor WhatsApp Admin Sweet Moments

const PAYMENT_OPTIONS = [
  "Transfer Bank (BCA / Mandiri / BRI)",
  "QRIS / E-Wallet (GoPay, OVO, Dana, ShopeePay)",
  "Bayar di Tempat / COD (Saat Ambil Kue)",
];

export default function OrderCheckoutForm({ product }: { product: ProductData }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0]);
  const [customPayment, setCustomPayment] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const totalPrice = product.price * quantity;
  const finalPaymentMethod = paymentMethod === "Lainnya" ? customPayment : paymentMethod;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim() || !customerPhone.trim() || !finalPaymentMethod.trim()) {
      setError("Mohon lengkapi Nama, Nomor Telepon, dan Metode Pembayaran.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customerName,
          customerPhone,
          paymentMethod: finalPaymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat pesanan");
      }

      setCreatedOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrder) {
    const waMessage = encodeURIComponent(
      `Halo Admin Sweet Moments! 🎂\n\nSaya sudah melakukan pemesanan kue melalui website dengan detail berikut:\n\n` +
      `*No. Pesanan:* ${createdOrder.orderNumber}\n` +
      `*Nama Pemesan:* ${createdOrder.customerName}\n` +
      `*No. Telepon:* ${createdOrder.customerPhone}\n` +
      `*Kue Pilihan:* ${product.name} (${quantity}x)\n` +
      `*Total Harga:* Rp ${totalPrice.toLocaleString("id-ID")}\n` +
      `*Metode Pembayaran:* ${createdOrder.paymentMethod}\n` +
      (createdOrder.notes ? `*Catatan:* ${createdOrder.notes}\n` : "") +
      `\nMohon info selanjutnya untuk proses pembayarannya ya. Terima kasih!`
    );

    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-amber-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Pesanan Berhasil Dibuat!
        </h2>
        <p className="text-gray-600 mb-6">
          Terima kasih, <span className="font-semibold text-gray-900">{createdOrder.customerName}</span>. Pesanan Anda telah masuk ke sistem kami.
        </p>

        <div className="bg-amber-50/70 rounded-2xl p-6 text-left mb-8 border border-amber-100 space-y-3 text-sm">
          <div className="flex justify-between border-b border-amber-200/60 pb-2">
            <span className="text-gray-500">Nomor Pesanan</span>
            <span className="font-bold text-amber-900">{createdOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-amber-200/60 pb-2">
            <span className="text-gray-500">Kue yang Dipesan</span>
            <span className="font-semibold text-gray-900">{product.name} x {quantity}</span>
          </div>
          <div className="flex justify-between border-b border-amber-200/60 pb-2">
            <span className="text-gray-500">Nomor Telepon</span>
            <span className="font-semibold text-gray-900">{createdOrder.customerPhone}</span>
          </div>
          <div className="flex justify-between border-b border-amber-200/60 pb-2">
            <span className="text-gray-500">Metode Pembayaran</span>
            <span className="font-semibold text-amber-800">{createdOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-1 text-base">
            <span className="font-bold text-gray-800">Total Pembayaran</span>
            <span className="font-extrabold text-amber-700">Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
          <p className="text-sm text-green-900 font-medium mb-4">
            Langkah terakhir: Silakan hubungi nomor WhatsApp Admin kami secara pribadi untuk konfirmasi pembayaran dan pengiriman kue Anda.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all text-base"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Hubungi Admin via WhatsApp (+62 812-3456-7890)
          </a>
        </div>

        <Link
          href="/kue"
          className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Katalog Kue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Detail Kue Spesifik yang Dipilih */}
      <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="relative h-64 w-full bg-amber-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-amber-400">
              Tidak ada gambar
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-amber-800 shadow-sm">
            {product.category}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Harga Satuan</span>
              <span className="font-medium text-gray-900">Rp {product.price.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Jumlah Pesanan</span>
              <span className="font-medium text-gray-900">{quantity} Kue</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-amber-800 pt-2 border-t border-gray-100">
              <span>Total Harga</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Pemesanan & Pembayaran */}
      <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-amber-600" />
          Formulir Pemesanan Kue
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Lengkapi informasi kontak dan metode pembayaran Anda di bawah ini.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Pemesan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap Pemesan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              />
            </div>
          </div>

          {/* Nomor Telepon / WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor Telepon / WhatsApp Aktif <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pastikan nomor aktif agar Admin mudah menghubungi Anda terkait pesanan.
            </p>
          </div>

          {/* Jumlah Kue */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Kue
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center py-2 border border-gray-300 rounded-xl font-semibold text-gray-900"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2.5">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === option
                      ? "border-amber-600 bg-amber-50/60 text-amber-900 font-medium"
                      : "border-gray-200 hover:border-amber-300 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option}
                    checked={paymentMethod === option}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500 mr-3"
                  />
                  <CreditCard className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}

              <label
                className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "Lainnya"
                    ? "border-amber-600 bg-amber-50/60 text-amber-900 font-medium"
                    : "border-gray-200 hover:border-amber-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Lainnya"
                  checked={paymentMethod === "Lainnya"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-amber-600 focus:ring-amber-500 mr-3"
                />
                <CreditCard className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" />
                <span className="text-sm">Isi Metode Pembayaran Sendiri (Lainnya)</span>
              </label>
            </div>

            {paymentMethod === "Lainnya" && (
              <div className="mt-3">
                <input
                  type="text"
                  required
                  value={customPayment}
                  onChange={(e) => setCustomPayment(e.target.value)}
                  placeholder="Ketik metode pembayaran Anda (misal: Transfer Bank Jago / SeaBank / dll)"
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                />
              </div>
            )}
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catatan Pesanan / Ucapan di Atas Kue (Opsional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tuliskan 'Happy Birthday Andi', diambil jam 3 sore..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || product.status === "out_of_stock"}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all ${
              isSubmitting || product.status === "out_of_stock"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Memproses Pesanan..." : `Buat Pesanan Sekarang (Rp ${totalPrice.toLocaleString("id-ID")})`}
          </button>
        </form>
      </div>
    </div>
  );
}
