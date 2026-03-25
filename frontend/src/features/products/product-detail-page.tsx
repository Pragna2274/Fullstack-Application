import { useEffect, useState } from "react"
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useCartStore } from "@/features/cart/cart.store"
import {
  addServerCartItem,
  deleteServerCartItem,
  updateServerCartItem,
} from "@/features/cart/cart.api"
import { getProductById } from "./products.api"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
}

const getServingLabel = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "pizza":
      return "Best shared between 2-3 people"
    case "burger":
      return "Great as a hearty single serving"
    case "dessert":
      return "Perfect as a sweet finishing treat"
    default:
      return "Freshly prepared for a satisfying meal"
  }
}

const getPdpHighlights = (product: Product) => {
  const category = product.category?.toLowerCase()

  if (category === "pizza") {
    return [
      "Balanced crust, topping, and cheese in every bite.",
      "Works well for sharing at lunch, dinner, or small gatherings.",
      "Easy to pair with dips, sides, and chilled drinks.",
    ]
  }

  if (category === "burger") {
    return [
      "Built for a hearty bite with soft bun texture and flavorful filling.",
      "A quick and satisfying pick for lunch, snacks, or dinner cravings.",
      "Pairs naturally with fries, peri peri sides, and cold beverages.",
    ]
  }

  if (category === "dessert") {
    return [
      "A comforting sweet option that feels rich without being too heavy.",
      "Great after meals or as a small anytime indulgence.",
      "Best enjoyed with coffee, shakes, or cold dessert pairings.",
    ]
  }

  return [
    "Prepared to feel filling, balanced, and easy to enjoy.",
    "Works well as a dependable pick for solo meals or casual group orders.",
    "Simple to combine with beverages and sides depending on your appetite.",
  ]
}

export default function ProductDetailPage() {
  const { id = "" } = useParams()
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setServerItemId = useCartStore((state) => state.setServerItemId)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const cartItem = items.find((item) => item.id === product?.id)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoadError("Product not found.")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setLoadError(null)

        const nextProduct = await getProductById(id)
        setProduct(nextProduct)
      } catch (error) {
        console.error("Failed to load product", error)
        setLoadError("Unable to load this product right now.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProduct()
  }, [id])

  const addToBackendIfLoggedIn = async () => {
    if (!product || !localStorage.getItem("accessToken")) {
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
    if (!product || !localStorage.getItem("accessToken") || !cartItem?.serverItemId) {
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

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/60">
          Loading product...
        </div>
      </section>
    )
  }

  if (loadError || !product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/60">
          <p className="text-lg font-semibold text-slate-900">
            {loadError || "Product not found."}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to menu
          </Link>
        </div>
      </section>
    )
  }

  const pdpHighlights = getPdpHighlights(product)

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <Link
        to="/"
        className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to menu
      </Link>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-slate-100 lg:h-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover sm:h-72 lg:h-full lg:min-h-[430px]"
            />
            {product.category ? (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-md sm:left-6 sm:top-6">
                {product.category}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col p-4 sm:p-5 lg:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
                Product details
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-[2.2rem]">
                {product.name}
              </h1>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                {getServingLabel(product.category)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                {product.description}
              </p>

              <div className="mt-4 rounded-[24px] border border-sky-100 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Price
                </p>
                <p className="mt-2 text-3xl font-black text-sky-700 sm:text-[2.25rem]">
                  Rs. {product.price.toFixed(2)}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Prep style
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Freshly made to order
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Portion
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {getServingLabel(product.category)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Delivery fit
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Packed for quick doorstep delivery
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-black uppercase tracking-[0.24em] text-slate-900">
                  More about this item
                </h2>
                <div className="mt-3 space-y-2">
                  {pdpHighlights.map((highlight) => (
                    <p
                      key={highlight}
                      className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600"
                    >
                      {highlight}
                    </p>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              {!cartItem ? (
                <button
                  onClick={async () => {
                    addItem(product)
                    await addToBackendIfLoggedIn()
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-slate-800 sm:w-auto"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </button>
              ) : (
                <div className="inline-flex w-full items-center justify-between rounded-full border border-sky-100 bg-sky-50 px-4 py-3 shadow-sm sm:max-w-xs">
                  <button
                    onClick={async () => {
                      await removeFromBackendIfLoggedIn()
                      removeItem(product.id)
                    }}
                    className="rounded-full bg-white p-3 text-slate-700 transition-all hover:scale-105"
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="min-w-10 text-center text-lg font-bold text-slate-900">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={async () => {
                      addItem(product)
                      await addToBackendIfLoggedIn()
                    }}
                    className="rounded-full bg-sky-700 p-3 text-white transition-all hover:scale-105"
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
