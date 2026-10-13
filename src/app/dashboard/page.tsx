import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Package, Clock, CakeSlice, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [orders, customOrders, reviews] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.customOrder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    })
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Akun</h1>
        <p className="text-gray-600 mt-1">Halo, {session.user.name}! Kelola pesanan dan aktivitas Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Quick Stats */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-4">
              <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold mr-3">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
              Profil Saya
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-900">{session.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-green-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Terverifikasi
                </span>
              </div>
            </div>
            <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium transition">
              Edit Profil
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-sm text-white p-6">
            <h3 className="font-bold text-lg mb-2">Ingin buat kue spesial?</h3>
            <p className="text-amber-100 text-sm mb-4">Pesan kue custom sesuai keinginanmu untuk momen spesial.</p>
            <Link href="/custom" className="block text-center bg-white text-amber-800 py-2 rounded-xl text-sm font-bold hover:bg-amber-50 transition">
              Buat Pesanan Custom
            </Link>
          </div>
        </div>

        {/* Right Column - Orders & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Regular Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-amber-600" /> Riwayat Pesanan
              </h2>
            </div>
            <div className="p-6">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between py-1">
                            <span>{item.quantity}x {item.product.name}</span>
                            <span className="font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-bold text-amber-700">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat pesanan.
                </div>
              )}
            </div>
          </div>

          {/* Custom Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <CakeSlice className="w-5 h-5 mr-2 text-purple-600" /> Pesanan Custom
              </h2>
            </div>
            <div className="p-6">
              {customOrders.length > 0 ? (
                <div className="space-y-4">
                  {customOrders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{order.eventType}</p>
                        <p className="text-xs text-gray-500">Untuk tgl: {new Date(order.requiredDate).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mb-1">
                          {order.status}
                        </span>
                        <p className="text-sm font-bold text-gray-900">
                          {order.estimatedPrice ? `Est. Rp ${order.estimatedPrice.toLocaleString('id-ID')}` : 'Menunggu Estimasi'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada pesanan custom.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
