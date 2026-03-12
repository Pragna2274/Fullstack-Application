import { API } from "@/api/axios"

export const getOrders = async () => {

  const res = await API.get("/orders")

  return res.data
}

export const createOrder = async (items: any[]) => {
  const payload = {
    items: items.map((i) => ({
      productId: i.id,
      quantity: i.quantity
    }))
  }

  const res = await API.post("/orders/place", payload)

  return res.data
}