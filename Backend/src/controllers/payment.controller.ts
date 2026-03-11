import { Request, Response } from "express"
import * as paymentService from "../services/payment.service.js"
import { prisma } from "../lib/prisma.js"
import { paymentSchema } from "../validations/payment.validation.js"

interface AuthRequest extends Request {
  userId?: string
}

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const parsed = paymentSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const { amount, orderId } = parsed.data

    const paymentIntent = await paymentService.createPaymentIntent(amount)

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

    res.json({
      clientSecret: paymentIntent.client_secret
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({ message: "Payment failed" })

  }
}