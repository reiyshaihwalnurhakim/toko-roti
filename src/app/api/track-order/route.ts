import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json(
        { message: "Masukkan Nomor Pesanan atau Nomor Telepon." },
        { status: 400 }
      );
    }

    const [orders, customOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q } },
            { customerPhone: { contains: q } },
          ],
        },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.customOrder.findMany({
        where: {
          customerPhone: { contains: q },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ orders, customOrders });
  } catch (error) {
    console.error("Track Order Error:", error);
    return NextResponse.json(
      { message: "Gagal mencari data pesanan." },
      { status: 500 }
    );
  }
}
