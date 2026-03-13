import { create } from "zustand"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  setItems: (items: CartItem[]) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }

      return {
        items: [...state.items, { ...item, quantity: 1 }]
      }
    }),

  removeItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id)

      if (!item) return state

      if (item.quantity === 1) {
        return {
          items: state.items.filter((i) => i.id !== id)
        }
      }

      return {
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      }
    }),

  setItems: (items) => set({ items }),

  clearCart: () => set({ items: [] })
}))
