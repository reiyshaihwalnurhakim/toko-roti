import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";

const prisma = new PrismaClient();

export default async function ReviewsPage() {
  const [reviews, products] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: true,
        product: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === star).length / totalReviews) * 100 : 0
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ulasan Pelanggan</h1>
        <p className="text-gray-600">Apa kata mereka tentang manisnya momen bersama Sweet Moments.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Summary Card + Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-6">Rating Keseluruhan</h3>
            
            <div className="flex items-center mb-8">
              <div className="text-5xl font-extrabold text-amber-700 mr-4">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-gray-500 text-sm">Berdasarkan {totalReviews} ulasan</div>
              </div>
            </div>

            <div className="space-y-3">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center text-sm">
                  <div className="w-12 text-gray-600 flex items-center">
                    {star} <Star className="w-3 h-3 ml-1" />
                  </div>
                  <div className="flex-1 mx-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-gray-500">{count}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-semibold mb-2">Tentang Ulasan Kami</h4>
              <p className="text-sm text-gray-500 flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                Masukkan Nomor Pesanan Anda saat menulis ulasan untuk mendapatkan lencana Pembeli Terverifikasi.
              </p>
            </div>
          </div>

          <ReviewForm products={products} />
        </div>

        {/* Reviews List */}
        <div className="w-full lg:w-2/3 space-y-6">
          {reviews.length > 0 ? reviews.map(review => {
            const displayName = review.customerName || review.user?.username || "Pelanggan";
            return (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold text-xl mr-4 flex-shrink-0 mt-1">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center flex-wrap gap-2">
                        {displayName}
                        {review.verifiedBuyer && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Pembeli Terverifikasi
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Membeli: <span className="font-medium text-gray-700">{review.product.name}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 text-gray-700 leading-relaxed">
                  {review.reviewText}
                </div>

                {review.photo && (
                  <div className="mt-4 relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200">
                    <Image 
                      src={review.photo} 
                      alt="Review photo" 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-200 text-gray-500">
              Belum ada ulasan. Jadilah yang pertama memberikan ulasan setelah melakukan pembelian!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
