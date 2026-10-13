import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { customerName, orderNumber, productId, rating, reviewText, photo } = body;

    if (!customerName || !productId || !rating || !reviewText) {
      return NextResponse.json(
        { message: "Nama, Kue yang dibeli, Rating, dan Isi Ulasan wajib diisi." },
        { status: 400 }
      );
    }

    let verifiedBuyer = false;
    let matchedOrderId: string | null = null;

    if (orderNumber && orderNumber.trim() !== "") {
      const foundOrder = await prisma.order.findUnique({
        where: { orderNumber: orderNumber.trim() },
      });
      if (foundOrder) {
        verifiedBuyer = true;
        matchedOrderId = foundOrder.id;
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: session?.user?.id || null,
        customerName: customerName.trim(),
        orderId: matchedOrderId,
        productId,
        rating: Math.min(5, Math.max(1, Number(rating))),
        reviewText: reviewText.trim(),
        photo: photo || null,
        verifiedBuyer,
      },
    });

    return NextResponse.json(
      { message: "Terima kasih atas ulasan Anda!", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Review Error:", error);
    return NextResponse.json(
      { message: "Gagal mengirim ulasan." },
      { status: 500 }
    );
  }
}
