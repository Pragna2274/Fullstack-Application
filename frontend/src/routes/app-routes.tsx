import { Routes, Route } from "react-router-dom"
import LoginPage from "@/features/auth/login-page"
import RegisterPage from "@/features/auth/register-page"
import HomePage from "@/features/products/home-page"
import CartPage from "@/features/cart/cart-page"
import OrdersPage from "@/features/orders/orders-page"
import ProfilePage from "@/features/profile/profile-page"
import PaymentSuccess from "@/features/payment/payment-success"
import ProtectedRoute from "./protected-route"

export default function AppRoutes() {

  return (

    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/payment-success" element={<PaymentSuccess />} />

    </Routes>

  )
}