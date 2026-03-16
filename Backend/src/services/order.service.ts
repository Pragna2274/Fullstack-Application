import { prisma } from "../lib/prisma.js"

type PlaceOrderItem = {
  productId: string
  quantity: number
}

export const placeOrder = async (userId: string, itemsFromRequest: PlaceOrderItem[]) => {
  if (itemsFromRequest.length === 0) {
    throw new Error("Order items are required")
  }

  const productIds = itemsFromRequest.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  })

  if (products.length !== productIds.length) {
    throw new Error("One or more products are no longer available")
  }

  const productMap = new Map(products.map((product) => [product.id, product]))

  const total = itemsFromRequest.reduce((sum, item) => {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new Error("One or more products are no longer available")
    }

    return sum + product.price * item.quantity
  }, 0)

  return prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: itemsFromRequest.map((item) => {
          const product = productMap.get(item.productId)

          if (!product) {
            throw new Error("One or more products are no longer available")
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          }
        }),
      }
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
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
