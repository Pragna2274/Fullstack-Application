import { Link, Navigate } from "react-router-dom"
import { ArrowRight, Clock3, MapPin, PackageCheck } from "lucide-react"
import { useAuthStore } from "@/features/auth/auth.store"
import { useOrdersStore } from "./orders.store"

const formatCurrency = (amount: number) => `Rs. ${amount.toFixed(2)}`

export default function OrdersPage() {
  const token = localStorage.getItem("accessToken")
  const currentUser = useAuthStore((state) => state.currentUser)
  const profilesByEmail = useAuthStore((state) => state.profilesByEmail)
  const savedEmail = localStorage.getItem("feasta-current-user-email")
  const ordersByUser = useOrdersStore((state) => state.ordersByUser)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const effectiveEmail = currentUser?.email || savedEmail || ""
  const effectiveUser =
    currentUser ||
    (effectiveEmail
      ? profilesByEmail[effectiveEmail] || {
          name: effectiveEmail.split("@")[0] || "Feasta User",
          email: effectiveEmail,
          address: "",
        }
      : null)

  const rawOrders =
    effectiveEmail && ordersByUser && typeof ordersByUser === "object"
      ? ordersByUser[effectiveEmail]
      : []

  const orders = Array.isArray(rawOrders) ? rawOrders : []

  if (!effectiveUser) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-sky-100 bg-white p-10 text-center shadow-lg shadow-sky-100/60">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No orders yet</h2>
          <p className="mt-3 text-sm text-slate-500">
            Place your first order and it will appear here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
            Order history
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Orders for {effectiveUser.name}
          </h1>
          {effectiveUser.address ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-sky-700" />
              {effectiveUser.address}
            </div>
          ) : null}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
        >
          Order again
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-sky-100 bg-white p-10 text-center shadow-lg shadow-sky-100/60">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No orders yet</h2>
          <p className="mt-3 text-sm text-slate-500">
            Orders placed while logged in with this account will appear here.
          </p>
        </div>
      ) : null}

      <div className="space-y-5">
        {orders.map((order) => {
          const items = Array.isArray(order.items) ? order.items : []

          return (
            <article
              key={order.id}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                    Order #{String(order.id).slice(0, 8)}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    {formatCurrency(Number(order.total) || 0)}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    <PackageCheck className="h-4 w-4" />
                    {order.status || "Placed"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                    {order.paymentMethod || "UPI"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4" />
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Today"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={`${order.id}-${item.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-sky-700">
                      {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0))}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
