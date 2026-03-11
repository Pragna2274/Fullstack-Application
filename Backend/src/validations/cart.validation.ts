import { z } from "zod"

export const addToCartSchema = z.object({
  productId: z.string().uuid("Invalid product id"),
  quantity: z.number().int().min(1, "Quantity must be at least 1")
})

export const updateCartSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1")
})