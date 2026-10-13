import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Star, ShoppingBag } from "lucide-react";
import ProductDetailTabs from "@/components/ProductDetailTabs";

const prisma = new PrismaClient();

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/kue" className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Kue
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 relative h-[380px] md:h-auto min-h-[460px]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-amber-50 text-amber-300">
                <span className="text-xl">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
            <div className="uppercase tracking-wider text-sm font-semibold text-amber-600 mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-2 text-gray-600 text-sm">
                ({product.reviews.length} ulasan)
              </span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="text-4xl font-bold text-amber-800 mb-8">
              Rp {product.price.toLocaleString('id-ID')}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Keunggulan Kue Kami</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Dibuat segar setiap hari (Freshly baked)
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Gratis pisau kue, lilin & kartu ucapan
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  100% Halal & Tanpa Bahan Pengawet
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              {product.status === 'out_of_stock' ? (
                <button
                  disabled
                  className="w-full py-4 rounded-xl text-lg font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Maaf, Stok Habis
                </button>
              ) : (
                <Link
                  href={`/pesan/${product.id}`}
                  className="inline-flex items-center justify-center w-full text-center py-4 rounded-xl text-lg font-bold transition-all shadow-md bg-amber-600 hover:bg-amber-700 text-white hover:shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Pesan Sekarang
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Product Detail Tabs */}
      <ProductDetailTabs
        productName={product.name}
        category={product.category}
        description={product.description}
        reviews={product.reviews}
      />
    </div>
  );
}
