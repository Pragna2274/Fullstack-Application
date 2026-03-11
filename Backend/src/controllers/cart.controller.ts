import { Request, Response } from "express"
import * as cartService from "../services/cart.service.js"
import { addToCartSchema, updateCartSchema } from "../validations/cart.validation.js"

interface AuthRequest extends Request {
  userId?: string
}

export const addItem = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const parsed = addToCartSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const { productId, quantity } = parsed.data

    const item = await cartService.addToCart(userId, productId, quantity)

    res.json(item)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to add item to cart" })
  }
}

export const getUserCart = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const cart = await cartService.getCart(userId)

    res.json(cart)

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" })
  }
}

export const updateItem = async (req: Request, res: Response) => {
  try {

    const parsed = updateCartSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const { quantity } = parsed.data

    const item = await cartService.updateCartItem(req.params.id as string, quantity)

    res.json(item)

  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" })
  }
}

export const deleteItem = async (req: Request, res: Response) => {
  try {

    await cartService.removeCartItem(req.params.id as string)

    res.json({ message: "Item removed from cart" })

  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item" })
  }
}