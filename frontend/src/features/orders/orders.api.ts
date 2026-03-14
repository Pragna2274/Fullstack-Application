import { API } from "@/api/axios"

export type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string
  }
}

export type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  paymentMethod?: "UPI" | "COD"
  items: OrderItem[]
}

export const getOrders = async () => {
  const res = await API.get<Order[]>("/orders")
  return res.data
}

export const createOrder = async (
  items: Array<{ id: string; quantity: number }>
) => {
  const res = await API.post<Order>("/orders/place", {
    items: items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  })

  return res.data
}
