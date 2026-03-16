import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  LoaderCircle,
  MapPin,
} from "lucide-react"
import { useCartStore } from "@/features/cart/cart.store"
import { useAuthStore } from "@/features/auth/auth.store"
import { createOrder } from "@/features/orders/orders.api"
import { useOrdersStore } from "@/features/orders/orders.store"
import axios from "axios"

const formatCurrency = (amount: number) => `Rs.${amount.toFixed(2)}`

type PaymentMethod = "UPI" | "COD"

export default function PaymentPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)          //Used to disable multiple clicks.
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)             //Used to prevent redirect issues.

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/login" replace state={{ from: "/payment" }} />
  }

  if (!currentUser) {
    return <Navigate to="/profile" replace />
  }

  if (items.length === 0 && !isOrderPlaced) {
    return <Navigate to="/cart" replace />
  }

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) {
      return
    }

    try {
      setIsPlacingOrder(true)
      setErrorMessage(null)

      const order = await createOrder(
        items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        }))
      )

      addOrder(
        currentUser.email,
        items,
        typeof order.total === "number" ? order.total : total,
        paymentMethod,
        {
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
        }
      )
      setIsOrderPlaced(true)
      clearCart()

      navigate("/order-success", { replace: true })
    } catch (error) {
      console.error("Failed to place order", error)

      if (axios.isAxiosError(error)) {
        const apiMessage =
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : null

        setErrorMessage(apiMessage || "Unable to place your order right now. Please try again.")
      } else {
        setErrorMessage("Unable to place your order right now. Please try again.")
      }
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f3f6fb] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="border-b border-slate-200 bg-[#fcfcfd] p-5 sm:p-8 lg:min-h-[760px] lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Back to cart"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="rounded-md bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                Payment
              </span>
            </div>

            <div className="mt-14">
              <p className="text-2xl font-medium text-slate-600 sm:text-3xl">Pay</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {formatCurrency(total)}
              </h1>
            </div>

            <div className="mt-16 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-slate-700 sm:text-xl">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-slate-700 sm:text-xl">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Delivery address
                  </p>
                  <p className="mt-2 text-base font-medium leading-7 text-slate-700">
                    {currentUser.address || "Add address in profile"}
                  </p>
                </div>
                <MapPin className="mt-1 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </aside>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                Select payment method
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Complete your order
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Choose your preferred payment option and place the order.
              </p>

              <div className="mt-8 space-y-4">
                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="mt-1 h-4 w-4 text-sky-700"
                  />
                  <div>
                    <p className="text-base font-semibold text-slate-900">UPI</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Place the order and pay on delivery or with your preferred UPI app.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 h-4 w-4 text-sky-700"
                  />
                  <div>
                    <p className="text-base font-semibold text-slate-900">Cash on Delivery</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Pay in cash when your order arrives.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-600">
                Your current selection: <span className="font-semibold">{paymentMethod}</span>
              </div>

              {errorMessage ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a7be0] py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0869be] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPlacingOrder ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
