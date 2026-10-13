import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    const data = await req.json();

    const customOrder = await prisma.customOrder.create({
      data: {
        userId: session?.user?.id || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        eventType: data.eventType,
        requiredDate: new Date(data.requiredDate),
        cakeSize: data.cakeSize,
        flavor: data.flavor,
        theme: data.theme,
        color: data.color,
        cakeText: data.cakeText,
        description: data.description,
        referenceImage: data.referenceImage || null,
        status: 'pending',
      }
    });

    return NextResponse.json(customOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
