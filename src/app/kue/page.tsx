import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

const prisma = new PrismaClient();

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.q || "";
  const category = sp.category || "";
  const sort = sp.sort || "newest";

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      },
      category: category ? { equals: category } : undefined,
    },
    orderBy,
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category']
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Koleksi Kue Kami</h1>
        <p className="text-gray-600">Temukan kue sempurna untuk setiap momen berharga Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-amber-600" /> Filter
            </h3>
            
            <form className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Kue</label>
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Nama kue..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select 
                  name="category" 
                  defaultValue={category}
                  className="w-full border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.category} value={c.category}>{c.category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                <select 
                  name="sort" 
                  defaultValue={sort}
                  className="w-full border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_asc">Harga (Terendah)</option>
                  <option value="price_desc">Harga (Tertinggi)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-amber-600 text-white font-medium py-2.5 rounded-lg hover:bg-amber-700 transition">
                Terapkan Filter
              </button>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-50">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No image</div>
                    )}
                    {product.status === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-white text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm">Habis Terjual</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-amber-700 shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="mt-auto">
                      <div className="text-xl font-bold text-amber-700 mb-4">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/kue/${product.id}`} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-center py-2 rounded-xl text-sm font-medium transition-colors border border-amber-100">
                          Detail
                        </Link>
                        {product.status === 'out_of_stock' ? (
                          <button
                            disabled
                            className="flex-1 text-center py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            Pesan
                          </button>
                        ) : (
                          <Link
                            href={`/pesan/${product.id}`}
                            className="flex-1 text-center py-2 rounded-xl text-sm font-medium transition-colors bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Pesan
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-lg">Tidak ada kue yang ditemukan dengan kriteria tersebut.</p>
                <Link href="/kue" className="text-amber-600 font-medium hover:underline mt-2 inline-block">Hapus Filter</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
