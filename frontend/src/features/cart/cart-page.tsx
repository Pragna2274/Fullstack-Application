import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react"
import { useCartStore } from "./cart.store"
import {
  addServerCartItem,
  deleteServerCartItem,
  updateServerCartItem,
} from "./cart.api"

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setServerItemId = useCartStore((state) => state.setServerItemId)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const syncIncremental = async (
    item: (typeof items)[number],
    action: "increment" | "decrement" | "remove"
  ) => {
    if (!localStorage.getItem("accessToken")) {
      return
    }

    try {
      if (action === "increment") {
        if (!item.serverItemId) {
          const createdItem = await addServerCartItem(item.id, 1)
          setServerItemId(item.id, createdItem.id)
          return
        }

        await updateServerCartItem(item.serverItemId, item.quantity + 1)
        return
      }

      if (!item.serverItemId) {
        return
      }

      if (action === "remove" || item.quantity === 1) {
        await deleteServerCartItem(item.serverItemId)
        return
      }

      await updateServerCartItem(item.serverItemId, item.quantity - 1)
    } catch (error) {
      console.error("Cart sync failed", error)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) {
      return
    }

    try {
      setIsCheckingOut(true)
      const token = localStorage.getItem("accessToken")

      if (!token) {
        navigate("/login", { state: { from: "/payment" } })
        return
      }

      navigate("/payment")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-[28px] border border-sky-100 bg-white p-10 text-center shadow-lg shadow-sky-100/60">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Add a few dishes from the menu and come back to complete your order.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            Browse menu
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
            Cart summary
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Review your Feasta order
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          Secure payment enabled
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_380px]">
        <div className="space-y-4">
          {items.map((item) => {
            const subtotal = item.price * item.quantity

            return (
              <article
                key={item.id}
                className="group flex flex-col gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:p-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-28"
                />

                <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Rs. {item.price.toFixed(2)} each
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Subtotal: <span className="text-sky-700">Rs. {subtotal.toFixed(2)}</span>
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await syncIncremental(item, "remove")
                      removeItem(item.id)
                    }}
                    className="hidden rounded-full border border-rose-200 p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50 sm:inline-flex"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
                    <button
                      onClick={async () => {
                        await syncIncremental(item, "decrement")
                        removeItem(item.id)
                      }}
                      className="rounded-full p-2 text-slate-600 transition-all hover:scale-105 hover:bg-white"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={async () => {
                        await syncIncremental(item, "increment")
                        addItem({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          price: item.price,
                          serverItemId: item.serverItemId,
                        })
                      }}
                      className="rounded-full bg-slate-950 p-2 text-white shadow-lg transition-all hover:scale-105"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      await syncIncremental(item, "remove")
                      removeItem(item.id)
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500 transition-all hover:scale-105 sm:hidden"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="h-fit rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
            Payment
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">Order total</h2>
          <div className="mt-8 space-y-4 rounded-2xl bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-sky-300">Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
