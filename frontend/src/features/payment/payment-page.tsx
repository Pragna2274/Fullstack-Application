import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { BadgeIndianRupee, CheckCircle2, MapPin, Smartphone } from "lucide-react"
import { syncCartToBackend } from "@/features/cart/cart.api"
import { useCartStore } from "@/features/cart/cart.store"
import { useAuthStore } from "@/features/auth/auth.store"
import { useOrdersStore } from "@/features/orders/orders.store"

type PaymentMethod = "UPI" | "COD"

const paymentOptions: Array<{
  id: PaymentMethod
  title: string
  description: string
  icon: typeof Smartphone
}> = [
  {
    id: "UPI",
    title: "UPI",
    description: "Pay using PhonePe, GPay, Paytm, or any UPI app",
    icon: Smartphone,
  },
  {
    id: "COD",
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: BadgeIndianRupee,
  },
]

export default function PaymentPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("UPI")

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/login" replace state={{ from: "/payment" }} />
  }

  if (!currentUser) {
    return <Navigate to="/profile" replace />
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handlePlaceOrder = async () => {
    addOrder(currentUser.email, items, total, selectedMethod)
    clearCart()
    try {
      await syncCartToBackend([])
    } catch (error) {
      console.error("Failed to clear backend cart", error)
    }
    navigate("/order-success", { replace: true })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
            Payment
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Choose a payment method
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Simple checkout with UPI or cash on delivery.
          </p>
        </div>
        <Link
          to="/cart"
          className="inline-flex self-start rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
        >
          Back to cart
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-4">
          {paymentOptions.map((option) => {
            const Icon = option.icon

            return (
              <button
                key={option.id}
                onClick={() => setSelectedMethod(option.id)}
                className={`flex w-full items-start gap-4 rounded-[24px] border p-5 text-left transition-all ${
                  selectedMethod === option.id
                    ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100/70"
                    : "border-slate-200 bg-white shadow-sm hover:border-sky-200"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    selectedMethod === option.id
                      ? "bg-sky-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-slate-950">{option.title}</h2>
                    {selectedMethod === option.id ? (
                      <CheckCircle2 className="h-5 w-5 text-sky-700" />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{option.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <aside className="h-fit rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
            Order summary
          </p>
          <div className="mt-6 rounded-2xl bg-white/8 p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Items</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Selected payment</span>
              <span>{selectedMethod}</span>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-300" />
                Address
              </span>
              <span className="max-w-[180px] text-right">
                {currentUser.address || "Add address in profile"}
              </span>
            </div>
            <div className="my-4 h-px bg-white/10" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-sky-300">Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full rounded-full bg-sky-700 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-sky-800"
          >
            Place order
          </button>
        </aside>
      </div>
    </section>
  )
}
