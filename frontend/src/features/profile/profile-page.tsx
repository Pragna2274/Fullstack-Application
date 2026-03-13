import { useMemo, useState } from "react"
import {
  CreditCard,
  MapPin,
  PackageCheck,
  PencilLine,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/auth.store"
import { useOrdersStore } from "@/features/orders/orders.store"

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const updateAddress = useAuthStore((state) => state.updateAddress)
  const ordersByUser = useOrdersStore((state) => state.ordersByUser)
  const [address, setAddress] = useState(currentUser?.address || "")

  const orderCount = useMemo(() => {
    if (!currentUser?.email) {
      return 0
    }

    return ordersByUser[currentUser.email]?.length || 0
  }, [currentUser?.email, ordersByUser])

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-800 px-8 py-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/15 text-2xl font-black backdrop-blur">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
                    Feasta account
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight">
                    {currentUser.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-200">{currentUser.email}</p>
                </div>
              </div>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100"
              >
                View orders
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-8 sm:grid-cols-3">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <PackageCheck className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">Orders placed</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{orderCount}</p>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">Account status</p>
              <p className="mt-2 text-lg font-bold text-slate-950">Verified login</p>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">Payments</p>
              <p className="mt-2 text-lg font-bold text-slate-950">Cash on checkout</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">Saved address</h2>
                <p className="text-sm text-slate-500">
                  Keep your delivery details ready for faster ordering
                </p>
              </div>
            </div>

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white"
              placeholder="Add house number, street, landmark, city, and pincode"
            />

            <button
              onClick={() => updateAddress(address)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
            >
              <PencilLine className="h-4 w-4" />
              Save address
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-xl font-black text-slate-950">Account info</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <UserRound className="mt-0.5 h-5 w-5 text-sky-700" />
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="font-semibold text-slate-950">{currentUser.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <Phone className="mt-0.5 h-5 w-5 text-sky-700" />
                <div>
                  <p className="text-sm text-slate-500">Contact</p>
                  <p className="font-semibold text-slate-950">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
