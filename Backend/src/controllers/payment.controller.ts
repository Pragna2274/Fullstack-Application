import { Request, Response } from "express"
import * as paymentService from "../services/payment.service.js"
import { prisma } from "../lib/prisma.js"
import { confirmPaymentSchema } from "../validations/payment.validation.js"

interface AuthRequest extends Request {
  userId?: string
}

export const getStripeConfig = async (_req: Request, res: Response) => {
  const publishableKey = process.env.STRIPE_PUBLIC_KEY?.trim()

  if (!publishableKey) {
    console.error("[stripe] missing STRIPE_PUBLIC_KEY")
    return res.status(500).json({ message: "Stripe publishable key is not configured" })
  }

  console.log("[stripe] publishable key requested")
  res.json({ publishableKey })
}

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

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
      return res.status(400).json({ message: "Cart is empty" })
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING_PAYMENT",
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    })

    const paymentIntent = await paymentService.createPaymentIntent(total, {
      orderId: order.id,
      userId
    })

    console.log("[stripe] create-payment-intent success", {
      userId,
      orderId: order.id,
      total,
      clientSecretPresent: Boolean(paymentIntent.client_secret),
      paymentIntentId: paymentIntent.id,
    })

    res.json({
      orderId: order.id,
      amount: total,
      clientSecret: paymentIntent.client_secret
    })

  } catch (error) {

    console.error("[stripe] create-payment-intent failed", error)

    res.status(500).json({ message: "Payment failed" })

  }
}

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const parsed = confirmPaymentSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const { orderId, paymentIntentId } = parsed.data

    const paymentIntent = await paymentService.retrievePaymentIntent(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment is not completed" })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      }
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (paymentIntent.metadata.orderId !== orderId || paymentIntent.metadata.userId !== userId) {
      return res.status(400).json({ message: "Payment does not match this order" })
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" }
    })

    const cart = await prisma.cart.findFirst({
      where: { userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    console.log("[stripe] payment confirmed", {
      userId,
      orderId,
      paymentIntentId,
    })

    res.json({ success: true })
  } catch (error) {
    console.error("[stripe] confirm-payment failed", error)
    res.status(500).json({ message: "Payment confirmation failed" })
  }
}
