import { prisma } from "../lib/prisma.js"

export const addToCart = async (userId: string, productId: string, quantity: number) => {

  let cart = await prisma.cart.findFirst({
    where: { userId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    })
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId
    }
  })

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      }
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity
    }
  })
}

export const getCart = async (userId: string) => {

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

  return cart
}

export const updateCartItem = async (itemId: string, quantity: number) => {

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  })
}

export const removeCartItem = async (itemId: string) => {

  return prisma.cartItem.delete({
    where: { id: itemId }
  })
}