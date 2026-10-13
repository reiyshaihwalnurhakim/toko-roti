import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, Clock, CheckCircle } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10 md:pr-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Manisnya Momen, <br className="hidden md:block" />
              <span className="text-amber-600">Dibuat dengan Cinta</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0">
              Temukan berbagai pilihan kue lezat untuk melengkapi setiap perayaan Anda. Dari ulang tahun hingga pernikahan, kami siap menyajikan yang terbaik.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link href="/kue" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium text-lg transition shadow-md inline-flex items-center justify-center">
                Lihat Kue
              </Link>
              <Link href="/custom" className="bg-white hover:bg-gray-50 text-amber-700 border border-amber-200 px-8 py-3 rounded-full font-medium text-lg transition shadow-sm inline-flex items-center justify-center">
                Buat Kue Custom
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80" 
                alt="Delicious cake" 
                fill
                style={{ objectFit: "cover" }}
                className="hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Star className="text-amber-500 w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900">4.9/5</p>
                <p className="text-xs text-gray-500">Dari 500+ pelanggan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Koleksi Unggulan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Pilihan kue favorit pelanggan yang selalu berhasil mencuri perhatian di setiap acara.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full text-amber-700">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold text-amber-700">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <Link href={`/kue/${product.id}`} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-center py-2.5 rounded-xl font-medium transition-colors">
                      Detail
                    </Link>
                    <Link
                      href={`/pesan/${product.id}`}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center py-2.5 rounded-xl font-medium transition-colors"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/kue" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Lihat Semua Kue <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dedikasi kami untuk memberikan pengalaman manis terbaik bagi setiap momen berharga Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Bahan Berkualitas</h3>
              <p className="text-gray-600 text-sm">Hanya menggunakan bahan-bahan premium pilihan untuk rasa yang tak terlupakan.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Dibuat Fresh</h3>
              <p className="text-gray-600 text-sm">Setiap kue dibuat segar sesuai pesanan untuk menjaga kualitas dan rasa.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Custom Desain</h3>
              <p className="text-gray-600 text-sm">Wujudkan desain kue impian Anda bersama tim dekorator profesional kami.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tepat Waktu</h3>
              <p className="text-gray-600 text-sm">Pengiriman aman dan tepat waktu untuk melancarkan acara spesial Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-amber-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1557308536-ee471ef2c3d9?w=1600&auto=format&fit=crop&q=80"
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Punya Desain Kue Impian Sendiri?</h2>
          <p className="text-amber-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Ceritakan ide Anda, dan biarkan kami mengubahnya menjadi kue yang lezat dan memukau untuk momen spesial Anda.
          </p>
          <Link href="/custom" className="bg-white text-amber-900 hover:bg-amber-50 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-xl inline-block">
            Pesan Kue Custom Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
