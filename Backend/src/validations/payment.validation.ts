import { z } from "zod"

export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  orderId: z.string().uuid("Invalid order id")
})