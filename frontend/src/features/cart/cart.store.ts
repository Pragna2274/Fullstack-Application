import { create } from "zustand"

type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: any) => void
  removeItem: (id: string) => void
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
    set((state) => ({
      items: state.items
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    }))

}))