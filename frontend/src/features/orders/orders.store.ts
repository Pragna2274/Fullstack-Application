import { create } from "zustand"
import { persist } from "zustand/middleware"

type StoredOrderItem = {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

export type StoredOrder = {
  id: string
  total: number
  status: string
  createdAt: string
  paymentMethod: "STRIPE" | "COD"
  items: StoredOrderItem[]
}

type OrdersState = {
  ordersByUser: Record<string, StoredOrder[]>
  addOrder: (
    email: string,
    items: StoredOrderItem[],
    total: number,
    paymentMethod: "STRIPE" | "COD"
  ) => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      ordersByUser: {},

      addOrder: (email, items, total, paymentMethod) =>
        set((state) => ({
          ordersByUser: {
            ...state.ordersByUser,
            [email]: [
              {
                id: crypto.randomUUID(),
                total,
                status: "Placed",
                createdAt: new Date().toISOString(),
                paymentMethod,
                items,
              },
              ...(state.ordersByUser[email] || []),
            ],
          },
        })),
    }),
    {
      name: "feasta-orders-store",
    }
  )
)
