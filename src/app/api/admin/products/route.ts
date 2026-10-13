import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, description, price, image, status } = body;

    if (!name || !category || !description || price === undefined) {
      return NextResponse.json(
        { message: "Nama, kategori, deskripsi, dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,
        price: Number(price),
        image: image || null,
        status: status || "available",
      },
    });

    return NextResponse.json({ message: "Produk berhasil ditambahkan", product }, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ message: "Gagal menambahkan produk" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, category, description, price, image, status } = body;

    if (!id) {
      return NextResponse.json({ message: "ID produk diperlukan" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(image !== undefined && { image }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ message: "Produk berhasil diperbarui", product: updated });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID produk diperlukan" }, { status: 400 });
    }

    // Delete related orderItems and reviews first if any exist to avoid foreign key constraint error
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ message: "Gagal menghapus produk" }, { status: 500 });
  }
}
