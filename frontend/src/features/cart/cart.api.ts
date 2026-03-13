import { API } from "@/api/axios"
import type { CartItem } from "./cart.store"

type ServerCartItem = {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

type ServerCart = {
  items?: ServerCartItem[]
} | null

export const getServerCart = async () => {
  const res = await API.get<ServerCart>("/cart")
  return res.data
}

export const addServerCartItem = async (productId: string, quantity: number) => {
  const res = await API.post("/cart/add", { productId, quantity })
  return res.data
}

export const deleteServerCartItem = async (itemId: string) => {
  const res = await API.delete(`/cart/item/${itemId}`)
  return res.data
}

export const syncCartToBackend = async (items: CartItem[]) => {
  const existingCart = await getServerCart()
  const existingItems = existingCart?.items ?? []

  await Promise.all(existingItems.map((item) => deleteServerCartItem(item.id)))
  await Promise.all(items.map((item) => addServerCartItem(item.id, item.quantity)))
}

export const loadCartFromBackend = async (): Promise<CartItem[]> => {
  const serverCart = await getServerCart()
  const items = serverCart?.items ?? []

  return items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity,
  }))
}
