import { Link } from "react-router-dom"
import { CheckCircle2, ClipboardList } from "lucide-react"
import { useAuthStore } from "@/features/auth/auth.store"

export default function OrderSuccess() {
  const currentUser = useAuthStore((state) => state.currentUser)

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-sky-100 bg-white p-10 text-center shadow-xl shadow-sky-100/70">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
          Order confirmed
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Order Placed Successfully
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
          Your food is being prepared. You can continue browsing and place
          another order anytime.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {currentUser ? (
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
            >
              <ClipboardList className="h-4 w-4" />
              View Orders
            </Link>
          ) : null}

          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            Order Again
          </Link>
        </div>
      </div>
    </section>
  )
}
