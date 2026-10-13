"use client";

import { useState } from "react";
import { Info, Sparkles, Truck, Star, Check, ShieldCheck, Clock } from "lucide-react";

type ReviewItem = {
  id: string;
  customerName: string | null;
  rating: number;
  reviewText: string;
  verifiedBuyer: boolean;
  createdAt: string | Date;
  user?: { username: string } | null;
};

export default function ProductDetailTabs({
  productName,
  category,
  description,
  reviews,
}: {
  productName: string;
  category: string;
  description: string;
  reviews: ReviewItem[];
}) {
  const [activeTab, setActiveTab] = useState<"detail" | "spesifikasi" | "pemesanan" | "ulasan">("detail");

  const tabs = [
    { id: "detail", label: "Deskripsi & Detail", icon: Info },
    { id: "spesifikasi", label: "Bahan & Penyimpanan", icon: Sparkles },
    { id: "pemesanan", label: "Info Pemesanan & Pengiriman", icon: Truck },
    { id: "ulasan", label: `Ulasan (${reviews.length})`, icon: Star },
  ] as const;

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b border-gray-100 bg-amber-50/40 px-4 pt-3 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center whitespace-nowrap px-5 py-3.5 text-sm font-semibold rounded-t-2xl transition-all border-b-2 ${
                isActive
                  ? "bg-white text-amber-800 border-amber-600 shadow-xs"
                  : "text-gray-600 border-transparent hover:text-amber-700 hover:bg-white/60"
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-amber-600" : "text-gray-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-10">
        {activeTab === "detail" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tentang {productName}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{description}</p>
              <p className="text-gray-600 leading-relaxed text-base mt-3">
                Setiap kue kategori <span className="font-semibold text-amber-800">{category}</span> dari Sweet Moments dibuat secara <em>handmade</em> oleh pastry chef berpengalaman kami. Tekstur kue yang lembut berpadu dengan manis yang pas sehingga tidak membuat enek dan cocok dinikmati seluruh keluarga.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Ukuran Standar</p>
                <p className="text-base font-bold text-gray-900 mt-1">Diameter 20 cm (8–10 Porsi)</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Kelengkapan Gratis</p>
                <p className="text-base font-bold text-gray-900 mt-1">Pisau Kue, Lilin & Kartu Ucapan</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Sertifikasi</p>
                <p className="text-base font-bold text-gray-900 mt-1">100% Bahan Halal & Higienis</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "spesifikasi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-amber-600" />
                Komposisi & Kualitas Bahan
              </h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Full Butter Pilihan:</strong> Menggunakan mentega murni berkualitas tinggi untuk aroma yang harum dan tekstur lembut.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Tanpa Bahan Pengawet:</strong> Dipanggang segar sesuai pesanan tanpa tambahan pengawet buatan maupun pemanis sintetis.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Informasi Alergen:</strong> Mengandung produk susu (dairy), telur, dan gandum (gluten).</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-600" />
                Panduan Penyimpanan
              </h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Suhu Ruang (AC):</strong> Tahan hingga 6–8 jam di ruangan sejuk terhindar dari sinar matahari langsung.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Di Dalam Kulkas (Chiller):</strong> Tahan hingga 3–4 hari jika disimpan di dalam wadah tertutup rapat.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Saran Penyajian:</strong> Keluarkan kue dari kulkas 15–20 menit sebelum dipotong agar teksturnya kembali lembut maksimal.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "pemesanan" && (
          <div className="space-y-4 text-sm text-gray-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Prosedur Pemesanan & Pengiriman</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mb-3">1</div>
                <h4 className="font-bold text-gray-900 mb-1">Klik Tombol Pesan</h4>
                <p>Isi nama, nomor telepon/WhatsApp aktif, jumlah kue, ucapan di atas kue, dan pilih metode pembayaran.</p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mb-3">2</div>
                <h4 className="font-bold text-gray-900 mb-1">Konfirmasi via WhatsApp</h4>
                <p>Setelah nomor pesanan keluar, klik tombol Hubungi Admin untuk konfirmasi pembayaran dan jadwal kirim.</p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mb-3">3</div>
                <h4 className="font-bold text-gray-900 mb-1">Ambil di Toko / Kurir</h4>
                <p>Kue dapat diambil langsung di outlet Sweet Moments atau dikirim aman dengan kurir instan mobil.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ulasan" && (
          <div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const displayName = review.customerName || review.user?.username || "Pelanggan";
                  return (
                    <div key={review.id} className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold mr-3">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center">
                              {displayName}
                              {review.verifiedBuyer && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="w-3 h-3 mr-1" /> Pembeli Terverifikasi
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.reviewText}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada ulasan untuk kue ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
