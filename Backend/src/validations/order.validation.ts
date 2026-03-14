import { z } from "zod"

export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product id is required"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .optional(),
})
