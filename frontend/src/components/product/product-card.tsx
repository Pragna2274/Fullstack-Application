import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/features/cart/cart.store"
import {
  addServerCartItem,
  deleteServerCartItem,
  updateServerCartItem,
} from "@/features/cart/cart.api"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
}

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setServerItemId = useCartStore((state) => state.setServerItemId)

  const cartItem = items.find((item) => item.id === product.id)

  const addToBackendIfLoggedIn = async () => {
    if (!localStorage.getItem("accessToken")) {
      return
    }

    try {
      if (!cartItem?.serverItemId) {
        const createdItem = await addServerCartItem(product.id, 1)
        setServerItemId(product.id, createdItem.id)
        return
      }

      await updateServerCartItem(cartItem.serverItemId, cartItem.quantity + 1)
    } catch (error) {
      console.error("Cart sync failed", error)
    }
  }

  const removeFromBackendIfLoggedIn = async () => {
    if (!localStorage.getItem("accessToken") || !cartItem?.serverItemId) {
      return
    }

    try {
      if (cartItem.quantity === 1) {
        await deleteServerCartItem(cartItem.serverItemId)
        return
      }

      await updateServerCartItem(cartItem.serverItemId, cartItem.quantity - 1)
    } catch (error) {
      console.error("Cart sync failed", error)
    }
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        {product.category ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-md">
            {product.category}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Price
            </p>
            <p className="text-2xl font-black text-sky-700">
              Rs. {product.price.toFixed(2)}
            </p>
          </div>

          {!cartItem ? (
            <button
              onClick={async () => {
                addItem(product)
                await addToBackendIfLoggedIn()
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-100 bg-sky-50 px-3 py-2 shadow-sm">
              <button
                onClick={async () => {
                  await removeFromBackendIfLoggedIn()
                  removeItem(product.id)
                }}
                className="rounded-full bg-white p-2 text-slate-700 transition-all hover:scale-105"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center text-sm font-bold text-slate-900">
                {cartItem.quantity}
              </span>
              <button
                onClick={async () => {
                  addItem(product)
                  await addToBackendIfLoggedIn()
                }}
                className="rounded-full bg-sky-700 p-2 text-white transition-all hover:scale-105"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
