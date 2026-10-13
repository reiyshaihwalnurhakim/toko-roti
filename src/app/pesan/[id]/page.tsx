import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderCheckoutForm from "@/components/OrderCheckoutForm";

const prisma = new PrismaClient();

export default async function PesanKuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/kue/${product.id}`}
        className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Detail Kue
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Pemesanan Kue
        </h1>
        <p className="text-gray-600 mt-1">
          Anda sedang memesan <span className="font-semibold text-amber-800">{product.name}</span>
        </p>
      </div>

      <OrderCheckoutForm product={product} />
    </div>
  );
}
