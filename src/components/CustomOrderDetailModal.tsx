"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, X, MessageCircle, Calendar, Cake, Palette, Type, FileText } from "lucide-react";

type CustomOrderData = {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  eventType: string;
  requiredDate: Date | string;
  cakeSize: string;
  flavor: string;
  theme: string | null;
  color: string | null;
  cakeText: string | null;
  description: string | null;
  referenceImage: string | null;
  estimatedPrice: number | null;
  status: string;
  user?: { username: string } | null;
};

export function formatPhoneForWA(phone: string | null | undefined) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

export default function CustomOrderDetailModal({ order }: { order: CustomOrderData }) {
  const [open, setOpen] = useState(false);
  const name = order.customerName || order.user?.username || "Pelanggan";
  const waNumber = formatPhoneForWA(order.customerPhone);
  const waText = encodeURIComponent(
    `Halo Kak ${name}, kami dari Admin Sweet Moments Bakery ingin mengonfirmasi pesanan Kue Custom (${order.eventType} - ${order.cakeSize}, rasa ${order.flavor}) untuk tanggal ${new Date(order.requiredDate).toLocaleDateString("id-ID")}.`
  );

  return (
    <>
      <div className="flex items-center space-x-1.5 mt-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-medium border border-amber-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> Detail {order.referenceImage ? "& Foto" : ""}
        </button>

        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat WhatsApp Pelanggan"
            className="inline-flex items-center px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> WA
          </a>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  Detail Pesanan Custom
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{name}</h3>
                <p className="text-sm text-gray-500">
                  {order.customerPhone || "-"} {order.customerEmail ? `• ${order.customerEmail}` : ""}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                <div>
                  <span className="text-gray-500 text-xs flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-amber-600" /> Acara & Tanggal
                  </span>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {order.eventType} ({new Date(order.requiredDate).toLocaleDateString("id-ID")})
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs flex items-center">
                    <Cake className="w-3.5 h-3.5 mr-1 text-amber-600" /> Ukuran & Rasa
                  </span>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {order.cakeSize} • {order.flavor}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1 text-amber-600" /> Tema & Warna
                  </span>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {order.theme || "-"} / {order.color || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs flex items-center">
                    <Type className="w-3.5 h-3.5 mr-1 text-amber-600" /> Tulisan di Kue
                  </span>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {order.cakeText ? `"${order.cakeText}"` : "-"}
                  </p>
                </div>
              </div>

              {order.estimatedPrice && (
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Estimasi Harga Sistem</span>
                  <span className="text-base font-bold text-amber-800">
                    Rp {order.estimatedPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-700 font-semibold flex items-center mb-1">
                  <FileText className="w-4 h-4 mr-1.5 text-amber-600" /> Catatan / Deskripsi Detail:
                </span>
                <div className="p-3.5 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-line border border-gray-100">
                  {order.description || "Tidak ada catatan tambahan."}
                </div>
              </div>

              <div>
                <span className="text-gray-700 font-semibold block mb-2">Foto Referensi:</span>
                {order.referenceImage ? (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={order.referenceImage}
                      alt="Referensi Kue Custom"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl text-gray-400 text-center text-xs border border-dashed border-gray-200">
                    Tidak ada foto referensi (atau sudah otomatis dihapus karena pesanan selesai/dibatalkan).
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              {waNumber ? (
                <a
                  href={`https://wa.me/${waNumber}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" /> Hubungi Pelanggan via WA
                </a>
              ) : (
                <span />
              )}
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
