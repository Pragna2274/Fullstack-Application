import { useEffect } from "react"
import Navbar from "@/components/layout/navbar"
import AppRoutes from "@/routes/app-routes"
import { useLocation } from "react-router-dom"
import { useAuthStore } from "@/features/auth/auth.store"
import { loadCartFromBackend } from "@/features/cart/cart.api"
import { useCartStore } from "@/features/cart/cart.store"

const LEGACY_STORAGE_KEYS = [
  "cart",
  "orders",
  "user",
  "wishlist",
  "expense_tracker_db",
  "feasta-current-user-email",
  "feasta-auth-store",
  "feasta-orders-store",
]

export default function App() {

  const location = useLocation()
  const syncCurrentUserFromStorage = useAuthStore(
    (state) => state.syncCurrentUserFromStorage
  )
  const currentUser = useAuthStore((state) => state.currentUser)
  const setItems = useCartStore((state) => state.setItems)

  useEffect(() => {
    LEGACY_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key)
    })
  }, [])

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      syncCurrentUserFromStorage()
    }
  }, [syncCurrentUserFromStorage])

  useEffect(() => {
    const loadCart = async () => {
      if (!localStorage.getItem("accessToken") || !currentUser) {
        return
      }

      try {
        const serverItems = await loadCartFromBackend()
        setItems(serverItems)
      } catch (error) {
        console.error("Failed to load cart from backend", error)
      }
    }

    loadCart()
  }, [currentUser, setItems])

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register"

  return (
    <div>

      {!hideNavbar && <Navbar />}

      <AppRoutes />

    </div>
  )
}
