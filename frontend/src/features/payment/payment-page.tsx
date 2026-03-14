import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe, type Stripe } from "@stripe/stripe-js"
import axios from "axios"
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  LoaderCircle,
  MapPin,
} from "lucide-react"
import { syncCartToBackend } from "@/features/cart/cart.api"
import { useCartStore } from "@/features/cart/cart.store"
import { useAuthStore } from "@/features/auth/auth.store"
import { confirmPayment, createPaymentIntent, getStripeConfig } from "./payment.api"

const PENDING_STRIPE_ORDER_KEY = "pendingStripeOrder"

const formatCurrency = (amount: number) => `Rs.${amount.toFixed(2)}`

type PendingStripeOrder = {
  email: string
  total: number
  paymentMethod: "STRIPE"
  items: Array<{
    id: string
    name: string
    image: string
    price: number
    quantity: number
  }>
}

type CreatedOrderMeta = {
  id: string
  total: number
}

type StripeCheckoutFormProps = {
  clientSecret: string
  orderId: string
  currentUser: {
    name: string
    email: string
    address: string
  }
  onSuccess: () => Promise<void>
}

function StripeCheckoutForm({
  clientSecret,
  orderId,
  currentUser,
  onSuccess,
}: StripeCheckoutFormProps) {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState(currentUser.email)
  const [cardholderName, setCardholderName] = useState(currentUser.name)
  const [country, setCountry] = useState("India")
  const [saveInfo, setSaveInfo] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stripeElementStyle = {
    base: {
      color: "#111827",
      fontSize: "18px",
      fontFamily: "Geist Variable, sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  } as const

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements || isSubmitting) {
      return
    }

    if (!email.trim()) {
      setErrorMessage("Email is required.")
      return
    }

    if (!cardholderName.trim()) {
      setErrorMessage("Cardholder name is required.")
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const cardNumberElement = elements.getElement(CardNumberElement)

      if (!cardNumberElement) {
        setErrorMessage("Card form is not ready yet. Please try again.")
        return
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName.trim(),
            email: email.trim(),
            address: {
              line1: currentUser.address || undefined,
              country: country === "India" ? "IN" : undefined,
            },
          },
        },
        setup_future_usage: saveInfo ? "off_session" : undefined,
      })

      if (error) {
        setErrorMessage(error.message || "Payment confirmation failed.")
        return
      }

      if (paymentIntent?.status === "succeeded") {
        await confirmPayment(orderId, paymentIntent.id)
        await onSuccess()
        navigate("/payment-success", { replace: true })
        return
      }

      setErrorMessage("Payment is still processing. Please wait a moment and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl bg-[#12d66f] px-4 py-4 text-xl font-bold text-slate-950 shadow-sm transition hover:bg-[#10c965]"
      >
        Pay with Link
      </button>

      <div className="flex items-center gap-4 text-sm text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div>
        <h3 className="text-[2rem] font-bold tracking-tight text-slate-800">Contact information</h3>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </label>
      </div>

      <div>
        <h3 className="text-[2rem] font-bold tracking-tight text-slate-800">Payment method</h3>
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <CreditCard className="h-5 w-5" />
            <span>Card</span>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Card information</p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="px-5 py-4">
                <CardNumberElement
                  options={{
                    style: stripeElementStyle,
                    showIcon: true,
                    placeholder: "1234 1234 1234 1234",
                  }}
                />
              </div>
              <div className="grid border-t border-slate-200 sm:grid-cols-2">
                <div className="border-b border-slate-200 px-5 py-4 sm:border-b-0 sm:border-r">
                  <CardExpiryElement
                    options={{
                      style: stripeElementStyle,
                      placeholder: "MM / YY",
                    }}
                  />
                </div>
                <div className="px-5 py-4">
                  <CardCvcElement
                    options={{
                      style: stripeElementStyle,
                      placeholder: "CVC",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Cardholder name
            </span>
            <input
              type="text"
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value)}
              placeholder="Full name on card"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Country or region
            </span>
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option>India</option>
            </select>
          </label>
        </div>
      </div>

      <label className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <input
          type="checkbox"
          checked={saveInfo}
          onChange={(event) => setSaveInfo(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
        />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Save my information for faster checkout
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Pay securely on this site and reuse saved payment details later.
          </p>
        </div>
      </label>

      <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-600">
        Use Stripe test card `4242 4242 4242 4242`, any future expiry date, and any
        3-digit CVC.
      </div>

      {errorMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-2xl bg-[#0a7be0] py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0869be] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Processing payment..." : "Pay"}
      </button>
    </form>
  )
}

export default function PaymentPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const currentUser = useAuthStore((state) => state.currentUser)
  const [createdOrder, setCreatedOrder] = useState<CreatedOrderMeta | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPreparingPayment, setIsPreparingPayment] = useState(false)
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)

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

  const pendingOrderSnapshot: PendingStripeOrder = {
    email: currentUser.email,
    total,
    paymentMethod: "STRIPE",
    items,
  }

  const finalizeSuccessfulPayment = async () => {
    clearCart()

    sessionStorage.removeItem(PENDING_STRIPE_ORDER_KEY)
    try {
      await syncCartToBackend([])
    } catch (error) {
      console.error("Failed to clear backend cart", error)
    }
  }

  const handlePreparePayment = async () => {
    if (isPreparingPayment || !stripePromise) {
      return
    }

    try {
      setIsPreparingPayment(true)
      setErrorMessage(null)

      await syncCartToBackend(items)

      let orderMeta = createdOrder

      if (!orderMeta) {
        const paymentIntent = await createPaymentIntent()

        orderMeta = {
          id: paymentIntent.orderId,
          total: paymentIntent.amount,
        }

        setCreatedOrder(orderMeta)
        sessionStorage.setItem(
          PENDING_STRIPE_ORDER_KEY,
          JSON.stringify({
            ...pendingOrderSnapshot,
            total: orderMeta.total,
          } satisfies PendingStripeOrder)
        )
        sessionStorage.setItem("paymentOrderId", orderMeta.id)
        sessionStorage.setItem("paymentOrderTotal", String(orderMeta.total))
        setClientSecret(paymentIntent.clientSecret)
        return
      }
    } catch (error) {
      console.error("Failed to initialize payment", error)

      if (axios.isAxiosError(error)) {
        const apiMessage =
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : null

        setErrorMessage(apiMessage || "Unable to start Stripe payment. Please try again.")
      } else {
        setErrorMessage("Unable to start Stripe payment. Please try again.")
      }
    } finally {
      setIsPreparingPayment(false)
    }
  }

  useEffect(() => {
    const loadStripeConfig = async () => {
      try {
        setIsLoadingStripe(true)
        setErrorMessage(null)

        const { publishableKey } = await getStripeConfig()
        setStripePromise(loadStripe(publishableKey))
      } catch (error) {
        console.error("Failed to load Stripe configuration", error)
        setErrorMessage("Unable to load Stripe checkout. Please try again.")
      } finally {
        setIsLoadingStripe(false)
      }
    }

    void loadStripeConfig()
  }, [])

  useEffect(() => {
    if (clientSecret || isPreparingPayment || !stripePromise || isLoadingStripe) {
      return
    }

    void handlePreparePayment()
  }, [clientSecret, isLoadingStripe, isPreparingPayment, stripePromise])

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f3f6fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="border-b border-slate-200 bg-[#fcfcfd] p-8 lg:min-h-[760px] lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Back to cart"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                Test Mode
              </span>
            </div>

            <div className="mt-14">
              <p className="text-3xl font-medium text-slate-600">Pay</p>
              <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-900">
                {formatCurrency(createdOrder?.total || total)}
              </h1>
            </div>

            <div className="mt-16 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold text-slate-700">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-xl font-semibold text-slate-700">
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

          <div className="p-8 lg:p-10">
            {!isLoadingStripe && !stripePromise ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Stripe checkout configuration could not be loaded from the backend.
                </p>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            ) : null}

            {clientSecret && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#0a7be0",
                      borderRadius: "16px",
                      colorBackground: "#ffffff",
                    },
                  },
                }}
              >
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  orderId={createdOrder?.id || ""}
                  currentUser={currentUser}
                  onSuccess={finalizeSuccessfulPayment}
                />
              </Elements>
            ) : (
              <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50">
                <div className="text-center">
                  <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-sky-700" />
                  <p className="mt-4 text-lg font-semibold text-slate-700">
                    {isLoadingStripe ? "Loading Stripe..." : "Preparing secure checkout..."}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {isLoadingStripe
                      ? "Fetching Stripe configuration from the backend."
                      : "Creating your order and Stripe payment session."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
