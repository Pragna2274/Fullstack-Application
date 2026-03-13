import { API } from "@/api/axios"
import type { CartItem } from "@/features/cart/cart.store"

type CheckoutResponse = {
  url?: string
}

type CheckoutResult = {
  url: string
}

export const startCheckout = async (items: CartItem[]): Promise<CheckoutResult> => {
  const res = await API.post<CheckoutResponse>("/payment/checkout", {
    items: items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  })

  if (!res.data.url) {
    throw new Error("Checkout URL not returned by the server.")
  }

  return {
    url: res.data.url,
  }
}
