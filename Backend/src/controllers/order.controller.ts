import { Request, Response } from "express"
import * as orderService from "../services/order.service.js"

interface AuthRequest extends Request {
  userId?: string
}

// place order (checkout)
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId!

    const order = await orderService.placeOrder(userId)

    res.json(order)

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Failed to place order" })
  }
}


// get all orders for logged in user
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId!

    const orders = await orderService.getOrders(userId)

    res.json(orders)

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Failed to fetch orders" })
  }
}


// get single order by id
export const getOrder = async (req: Request, res: Response) => {
  try {

    const { id } = req.params as { id: string }

    const order = await orderService.getOrderById(id)

    res.json(order)

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Failed to fetch order" })
  }
}