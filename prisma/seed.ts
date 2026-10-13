import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing
  await prisma.review.deleteMany()
  await prisma.customOrder.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // Create admin
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@bakery.com',
      password: passwordHash,
      role: 'admin',
      email_verified: true,
      phone: '081234567890'
    }
  })

  // Create user
  const user = await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'john@example.com',
      password: passwordHash,
      role: 'user',
      email_verified: true,
      phone: '081234567891'
    }
  })

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Classic Chocolate Cake',
        category: 'Birthday Cake',
        description: 'Rich chocolate layer cake with fudge frosting.',
        price: 250000,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'available'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Strawberry Shortcake',
        category: 'Dessert',
        description: 'Light sponge cake with fresh strawberries and whipped cream.',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'available'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Red Velvet Cupcake',
        category: 'Cupcake',
        description: 'Classic red velvet cupcake with cream cheese frosting.',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'available'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Elegant Wedding Cake',
        category: 'Wedding Cake',
        description: 'Three-tier vanilla cake with buttercream flowers.',
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'available'
      }
    })
  ])

  // Create an order for the user
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      orderNumber: 'ORD-001',
      totalPrice: 250000,
      status: 'completed',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 250000
          }
        ]
      }
    }
  })

  // Create a review
  await prisma.review.create({
    data: {
      userId: user.id,
      orderId: order.id,
      productId: products[0].id,
      rating: 5,
      reviewText: 'This chocolate cake was amazing! Perfect for my birthday.',
      verifiedBuyer: true
    }
  })

  console.log('Seed data inserted successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
