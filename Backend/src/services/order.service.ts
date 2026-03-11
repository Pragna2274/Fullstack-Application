import { prisma } from "../lib/prisma.js"

export const placeOrder = async (userId: string) => {

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    },
    include: { items: true }
  })

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  })

  return order
}

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}

export const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}