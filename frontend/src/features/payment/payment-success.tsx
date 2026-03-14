import { Link } from "react-router-dom"
import { useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { useCartStore } from "@/features/cart/cart.store"

const PENDING_STRIPE_ORDER_KEY = "pendingStripeOrder"

export default function PaymentSuccess() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
    sessionStorage.removeItem(PENDING_STRIPE_ORDER_KEY)
    sessionStorage.removeItem("paymentOrderId")
    sessionStorage.removeItem("paymentOrderTotal")
  }, [clearCart])

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-sky-100 bg-white p-10 shadow-2xl shadow-sky-100/70">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
          Order confirmed
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Payment successful
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
          Your order has been placed successfully. You can track updates from the
          orders page or continue exploring the menu.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800"
          >
            View orders
          </Link>
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
