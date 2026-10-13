import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      productId,
      quantity = 1,
      customerName,
      customerPhone,
      paymentMethod,
      notes,
    } = body;

    if (!productId || !customerName || !customerPhone || !paymentMethod) {
      return NextResponse.json(
        { message: "Mohon lengkapi semua data pemesanan (Nama, No. Telepon, dan Metode Pembayaran)." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status === "out_of_stock") {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau stok sedang habis." },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const totalPrice = product.price * qty;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        customerName,
        customerPhone,
        paymentMethod,
        notes: notes || null,
        orderNumber,
        totalPrice,
        status: "pending",
        items: {
          create: [
            {
              productId: product.id,
              quantity: qty,
              price: product.price,
            },
          ],
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Pesanan berhasil dibuat!", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses pesanan." },
      { status: 500 }
    );
  }
}
