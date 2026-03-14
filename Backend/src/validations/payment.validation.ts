import { z } from "zod"

export const confirmPaymentSchema = z.object({
  orderId: z.string().uuid("Invalid order id"),
  paymentIntentId: z.string().min(1, "Payment intent id is required")
})
