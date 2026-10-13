"use client";

import { useState } from "react";
import { Search, Package, CakeSlice, CheckCircle2, Clock, XCircle, MessageCircle } from "lucide-react";

const ADMIN_WHATSAPP = "6281234567890";

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Selesai / Siap Diambil
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        <XCircle className="w-3.5 h-3.5 mr-1" /> Dibatalkan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      <Clock className="w-3.5 h-3.5 mr-1" /> Menunggu / Sedang Diproses
    </span>
  );
}

export default function CekPesananPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/track-order?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setCustomOrders(data.customOrders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalFound = orders.length + customOrders.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Lacak Status Pesanan
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Masukkan <strong>Nomor Pesanan</strong> (contoh: <code className="bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">ORD-...</code>) atau <strong>Nomor Telepon / WhatsApp</strong> yang Anda gunakan saat memesan.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik Nomor Pesanan (ORD-...) atau Nomor HP (0812...)"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm shadow-sm transition-colors"
        >
          {loading ? "Mencari..." : "Cek Status"}
        </button>
      </form>

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-8">
          {totalFound === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200 text-gray-500">
              <p className="text-lg font-medium text-gray-700 mb-1">
                Pesanan tidak ditemukan
              </p>
              <p className="text-sm">
                Pastikan Nomor Pesanan atau Nomor Telepon yang Anda masukkan sudah benar.
              </p>
            </div>
          ) : (
            <>
              {/* Regular Orders */}
              {orders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-amber-600" />
                    Pesanan Katalog Kue ({orders.length})
                  </h2>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-extrabold text-amber-900 text-base">
                            {order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 pt-1">
                          {order.items
                            .map((it: any) => `${it.product?.name || "Kue"} x ${it.quantity}`)
                            .join(", ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pemesan: {order.customerName || "Pelanggan"} ({order.customerPhone || "-"}) • Pembayaran: {order.paymentMethod || "-"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Dipesan pada: {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                        <div className="text-lg font-extrabold text-amber-700">
                          Rp {order.totalPrice.toLocaleString("id-ID")}
                        </div>
                        <a
                          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                            `Halo Admin Sweet Moments, saya ingin menanyakan status pesanan *${order.orderNumber}* atas nama *${order.customerName || ""}*.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3.5 py-2 rounded-xl border border-green-200 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Tanya Admin via WA
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Orders */}
              {customOrders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <CakeSlice className="w-5 h-5 mr-2 text-amber-600" />
                    Pesanan Kue Custom ({customOrders.length})
                  </h2>
                  {customOrders.map((co) => (
                    <div
                      key={co.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-gray-900 text-base">
                            Kue Custom {co.eventType}
                          </span>
                          <StatusBadge status={co.status} />
                        </div>
                        <p className="text-sm text-gray-700">
                          Ukuran: <strong>{co.cakeSize}</strong> • Rasa: <strong>{co.flavor}</strong>
                          {co.theme ? ` • Tema: ${co.theme}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          Untuk Tanggal Acara: <strong>{new Date(co.requiredDate).toLocaleDateString("id-ID")}</strong> • Pemesan: {co.customerName} ({co.customerPhone})
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                        {co.estimatedPrice && (
                          <div className="text-lg font-extrabold text-amber-700">
                            Est. Rp {co.estimatedPrice.toLocaleString("id-ID")}
                          </div>
                        )}
                        <a
                          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                            `Halo Admin Sweet Moments, saya ingin menanyakan status pesanan *Kue Custom (${co.eventType})* atas nama *${co.customerName || ""}* (${co.customerPhone || ""}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3.5 py-2 rounded-xl border border-green-200 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Tanya Admin via WA
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
