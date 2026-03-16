import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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
  paymentMethod: "UPI" | "COD"
  items: StoredOrderItem[]
}

type OrdersState = {
  ordersByUser: Record<string, StoredOrder[]>
  addOrder: (
    email: string,
    items: StoredOrderItem[],
    total: number,
    paymentMethod: "UPI" | "COD",
    options?: {
      id?: string
      status?: string
      createdAt?: string
    }
  ) => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      ordersByUser: {},

      addOrder: (email, items, total, paymentMethod, options) =>
        set((state) => ({
          ordersByUser: {
            ...state.ordersByUser,
            [email]: [
              {
                id: options?.id || crypto.randomUUID(),
                total,
                status: options?.status || "Placed",
                createdAt: options?.createdAt || new Date().toISOString(),
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
