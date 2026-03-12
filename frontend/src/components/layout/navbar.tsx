import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/features/cart/cart.store"
import { useState } from "react"
import CartSidebar from "@/components/cart/cart-sidebar"

export default function Navbar() {

  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)

  const [open, setOpen] = useState(false)

  const token = localStorage.getItem("accessToken")

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="text-2xl font-bold tracking-wide">
          🍴 Feasta
        </Link>

        <div className="flex items-center gap-6">

          {/* Cart Button */}
         <button
          onClick={() => setOpen(true)}
          className="relative bg-gray-900 px-3 py-1 rounded hover:bg-gray-800">
                Cart

            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-500 text-black text-xs px-2 py-[1px] rounded-full">
                {items.length}
              </span>
            )}
          </button>

          {!token && (
            <Link to="/login">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                Login
              </Button>
            </Link>
          )}

          {token && (
            <>
              <Link to="/profile">
                <Button variant="outline" className="border-white text-white">
                  Profile
                </Button>
              </Link>

              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </>
          )}

        </div>

      </div>

      <CartSidebar open={open} setOpen={setOpen} />

    </header>
  )
}