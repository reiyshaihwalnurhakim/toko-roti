import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Get the current order first
    const currentOrder = await prisma.customOrder.findUnique({
      where: { id }
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the status
    const updatedOrder = await prisma.customOrder.update({
      where: { id },
      data: { status }
    });

    // AUTO CLEANUP LOGIC:
    // If the order is marked as completed or cancelled, and it has a reference image, delete the image from local storage
    if ((status === 'completed' || status === 'cancelled') && currentOrder.referenceImage) {
      if (currentOrder.referenceImage.startsWith('/uploads/')) {
        const filename = currentOrder.referenceImage.replace('/uploads/', '');
        const filepath = join(process.cwd(), 'public', 'uploads', filename);
        
        if (existsSync(filepath)) {
          await unlink(filepath);
          console.log(`[Auto-Cleanup] Successfully deleted image: ${filename} for completed/cancelled order ${id}`);
          
          // Optionally remove the reference from the database to mark it as cleaned up
          await prisma.customOrder.update({
            where: { id },
            data: { referenceImage: '[Cleaned Up]' }
          });
        }
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update Status Error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
