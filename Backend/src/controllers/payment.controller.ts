import { Request, Response } from "express"
import * as paymentService from "../services/payment.service.js"

export const createPaymentIntent = async (req: Request, res: Response) => {

  try {

    const { amount } = req.body

    const paymentIntent = await paymentService.createPaymentIntent(amount)

    res.json({
      clientSecret: paymentIntent.client_secret
    })

  } catch (error) {

    res.status(500).json({ message: "Payment failed" })

  }

}