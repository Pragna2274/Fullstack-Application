import { Link, useLocation, useNavigate } from "react-router-dom"
import { ClipboardList, LogIn, LogOut, ShoppingBag, UserRound } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/features/cart/cart.store"
import { useAuthStore } from "@/features/auth/auth.store"
import CartSidebar from "@/components/cart/cart-sidebar"

const navLinkClass =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-sky-50 hover:text-sky-700"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = useCartStore((state) => state.items)
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  const [open, setOpen] = useState(false)

  const token = localStorage.getItem("accessToken")
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    logout()
    navigate("/", { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-md">
                F
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-950">Feasta</p>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                  Simple food ordering
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              to="/"
              className={`${navLinkClass} ${
                location.pathname === "/" ? "bg-sky-50 text-sky-700" : ""
              }`}
            >
              Explore
            </Link>
            {token ? (
              <>
                <Link
                  to="/orders"
                  className={`${navLinkClass} ${
                    location.pathname === "/orders" ? "bg-sky-50 text-sky-700" : ""
                  }`}
                >
                  <ClipboardList className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className={`${navLinkClass} ${
                    location.pathname === "/profile" ? "bg-sky-50 text-sky-700" : ""
                  }`}
                >
                  <UserRound className="h-4 w-4" />
                  {currentUser?.name || "Profile"}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {token ? (
              <Link to="/profile" className="hidden sm:block md:hidden">
                <Button
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : null}

            {token ? (
              <Link to="/orders" className="md:hidden">
                <Button
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  <ClipboardList className="h-4 w-4" />
                  Orders
                </Button>
              </Link>
            ) : null}

            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>

            {token ? (
              <Button
                onClick={handleLogout}
                className="rounded-full bg-sky-700 px-5 text-white shadow-md hover:bg-sky-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button className="rounded-full bg-sky-700 px-5 text-white shadow-md hover:bg-sky-800">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <CartSidebar open={open} setOpen={setOpen} />
    </>
  )
}
