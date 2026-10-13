import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Package, ShoppingCart, Users, Star, CakeSlice, MessageCircle } from "lucide-react";
import CustomOrderStatusForm from "@/components/CustomOrderStatusForm";
import OrderStatusForm from "@/components/OrderStatusForm";
import AdminProductManager from "@/components/AdminProductManager";
import CustomOrderDetailModal from "@/components/CustomOrderDetailModal";

const prisma = new PrismaClient();

function toWaNumber(phone: string | null | undefined) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const [
    totalProducts,
    totalOrders,
    totalCustomOrders,
    totalUsers,
    totalReviews,
    recentOrders,
    recentCustomOrders,
    allProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.customOrder.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.review.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    }),
    prisma.customOrder.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const stats = [
    { name: 'Total Produk', value: totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Pesanan', value: totalOrders, icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pesanan Custom', value: totalCustomOrders, icon: CakeSlice, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Pelanggan', value: totalUsers, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Total Ulasan', value: totalReviews, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {session.user.name}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-xl mr-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pesanan Kue Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Order / Kue</th>
                  <th className="pb-3 font-medium">Pelanggan & Telp</th>
                  <th className="pb-3 font-medium">Pembayaran & Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const waNum = toWaNumber(order.customerPhone);
                  return (
                    <tr key={order.id}>
                      <td className="py-4 text-sm font-medium text-gray-900 pr-2">
                        <div>{order.orderNumber}</div>
                        <div className="text-xs text-amber-700 font-normal">
                          {order.items.map((it) => `${it.product.name} (${it.quantity}x)`).join(", ")}
                        </div>
                        {order.notes && (
                          <div className="text-[11px] text-gray-500 italic mt-0.5">
                            Catatan: &ldquo;{order.notes}&rdquo;
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-800 pr-2">
                        <div className="font-medium">{order.customerName || order.user?.username || "Pelanggan"}</div>
                        {order.customerPhone && (
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-xs text-gray-500">{order.customerPhone}</span>
                            {waNum && (
                              <a
                                href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                                  `Halo Kak ${order.customerName || ""}, kami dari Admin Sweet Moments Bakery mengonfirmasi pesanan ${order.orderNumber}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-1.5 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[11px] font-medium border border-green-200"
                              >
                                <MessageCircle className="w-3 h-3 mr-0.5" /> WA
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-900 font-medium pr-2">
                        <div>Rp {order.totalPrice.toLocaleString('id-ID')}</div>
                        {order.paymentMethod && (
                          <div className="text-xs text-gray-500 font-normal">{order.paymentMethod}</div>
                        )}
                      </td>
                      <td className="py-4 text-sm">
                        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pesanan Custom Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Pelanggan</th>
                  <th className="pb-3 font-medium">Acara & Detail</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentCustomOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 text-sm font-medium text-gray-900 pr-2">
                      <div>{order.customerName || order.user?.username || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      <CustomOrderDetailModal order={order} />
                    </td>
                    <td className="py-4 text-sm text-gray-600 pr-2">
                      <div className="font-medium text-gray-900">{order.eventType}</div>
                      <div className="text-xs text-gray-500">{order.cakeSize}, {order.flavor}</div>
                    </td>
                    <td className="py-4 text-sm text-gray-900 pr-2">
                      {new Date(order.requiredDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 text-sm">
                      <CustomOrderStatusForm orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manajemen Katalog Kue */}
      <AdminProductManager initialProducts={allProducts} />
    </div>
  );
}
