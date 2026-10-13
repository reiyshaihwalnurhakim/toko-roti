"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Upload, CheckCircle2, X, MessageCircle } from "lucide-react";

const ADMIN_WHATSAPP = "6281234567890";

export default function CustomCakePage() {
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(250000);
  const [file, setFile] = useState<File | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    eventType: 'Ulang Tahun',
    requiredDate: '',
    cakeSize: '20cm',
    flavor: 'Chocolate',
    theme: '',
    color: '',
    cakeText: '',
    description: '',
  });

  const calculateEstimate = (data: any) => {
    let base = 250000;
    if (data.cakeSize === '24cm') base += 100000;
    if (data.cakeSize === '30cm') base += 250000;
    if (data.cakeSize === 'Bertingkat (2 Tier)') base += 600000;
    if (data.flavor === 'Red Velvet' || data.flavor === 'Black Forest') base += 50000;
    setEstimatedPrice(base);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    calculateEstimate(newData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 1 * 1024 * 1024) {
        alert("Ukuran file maksimal adalah 1MB.");
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let referenceImage = '';
    
    try {
      // 1. Upload file if exists
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileData
        });
        
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          referenceImage = url;
        } else {
          const { error } = await uploadRes.json();
          alert(`Gagal mengupload gambar: ${error}`);
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Submit order
      const res = await fetch('/api/custom-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, referenceImage })
      });
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Gagal mengirim pesanan. Silakan coba lagi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const waMessage = encodeURIComponent(
      `Halo Admin Sweet Moments! 🎂\n\nSaya baru saja mengirim request *Kue Custom* di website dengan rincian:\n\n` +
      `*Nama:* ${formData.customerName}\n` +
      `*No. Telepon:* ${formData.customerPhone}\n` +
      `*Acara & Tanggal:* ${formData.eventType} (${formData.requiredDate})\n` +
      `*Ukuran & Rasa:* ${formData.cakeSize} - ${formData.flavor}\n` +
      (formData.theme ? `*Tema / Warna:* ${formData.theme} / ${formData.color || "-"}\n` : "") +
      (formData.cakeText ? `*Tulisan di Kue:* "${formData.cakeText}"\n` : "") +
      `*Estimasi Harga:* Rp ${estimatedPrice.toLocaleString("id-ID")}\n\n` +
      `Mohon dibantu untuk diskusi desain dan pembayarannya ya. Terima kasih!`
    );
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl shadow-lg border border-amber-100 p-8 md:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Pesanan Custom Berhasil Terkirim!</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih, <span className="font-semibold text-gray-900">{formData.customerName}</span>. Detail desain kue custom Anda sudah masuk ke sistem kami.
          </p>

          <div className="bg-amber-50/70 rounded-2xl p-5 text-left mb-6 border border-amber-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Acara & Tanggal</span>
              <span className="font-semibold text-gray-900">{formData.eventType} ({formData.requiredDate})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ukuran & Rasa</span>
              <span className="font-semibold text-gray-900">{formData.cakeSize} • {formData.flavor}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amber-200/60 text-base">
              <span className="font-bold text-gray-800">Estimasi Harga</span>
              <span className="font-extrabold text-amber-700">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <p className="text-sm text-green-900 font-medium mb-4">
              Silakan hubungi nomor WhatsApp Admin kami secara pribadi untuk konsultasi desain dan konfirmasi pembayaran:
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all text-base"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Hubungi Admin via WhatsApp
            </a>
          </div>

          <button onClick={() => window.location.href = '/'} className="text-amber-700 hover:text-amber-900 font-medium text-sm">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Buat Kue Custom Anda</h1>
        <p className="text-gray-600">Wujudkan desain kue impian Anda. Isi form di bawah ini dan kami akan menghitung estimasi biaya untuk Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Form */}
          <div className="md:col-span-2 p-8 border-r border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="pb-4 border-b border-gray-100 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="customerEmail" required value={formData.customerEmail} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" placeholder="email@contoh.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp</label>
                  <input type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" placeholder="08123456789" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Detail Kue</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Acara</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border">
                    <option>Ulang Tahun</option>
                    <option>Pernikahan</option>
                    <option>Anniversary</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Diperlukan</label>
                  <input type="date" name="requiredDate" required value={formData.requiredDate} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Kue</label>
                  <select name="cakeSize" value={formData.cakeSize} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border">
                    <option>16cm (Kecil)</option>
                    <option>20cm (Sedang)</option>
                    <option>24cm (Besar)</option>
                    <option>30cm (Sangat Besar)</option>
                    <option>Bertingkat (2 Tier)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rasa Utama</label>
                  <select name="flavor" value={formData.flavor} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border">
                    <option>Vanilla</option>
                    <option>Chocolate</option>
                    <option>Red Velvet</option>
                    <option>Black Forest</option>
                    <option>Moka</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tema / Dekorasi (Opsional)</label>
                  <input type="text" name="theme" placeholder="Misal: Princess, Minimalis, Floral" value={formData.theme} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dominan Warna</label>
                  <input type="text" name="color" placeholder="Misal: Pink pastel, Putih tulang" value={formData.color} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tulisan pada Kue (Opsional)</label>
                <input type="text" name="cakeText" placeholder="Misal: Happy Birthday Mba Nana" value={formData.cakeText} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Detail</label>
                <textarea name="description" rows={4} placeholder="Ceritakan detail desain atau permintaan khusus lainnya..." required value={formData.description} onChange={handleChange} className="w-full border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3 border"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Referensi Desain (Opsional)</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${file ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                  {file ? (
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-800">{file.name}</p>
                      <button type="button" onClick={() => setFile(null)} className="mt-2 text-xs text-red-600 flex items-center justify-center mx-auto hover:underline">
                        <X className="w-3 h-3 mr-1" /> Hapus
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center mt-2">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 px-3 py-1 shadow-sm border border-amber-200">
                          <span>Pilih File</span>
                          <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 1MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl text-lg font-bold transition-all shadow-md ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan Custom'}
                </button>
              </div>
            </form>
          </div>

          {/* Summary / Estimate */}
          <div className="p-8 bg-amber-50/50">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Estimasi Pesanan</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Ukuran ({formData.cakeSize})</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Rasa ({formData.flavor})</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Tema/Dekorasi</span>
                <span className="text-gray-900 font-medium">{formData.theme || '-'}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <p className="text-sm text-gray-500 mb-2">Estimasi Harga Mulai Dari</p>
              <div className="text-3xl font-bold text-amber-700">
                Rp {estimatedPrice > 0 ? estimatedPrice.toLocaleString('id-ID') : '250.000'}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *Harga final akan disesuaikan dengan tingkat kesulitan dekorasi setelah dikonfirmasi oleh tim kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
