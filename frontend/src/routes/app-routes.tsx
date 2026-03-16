import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import ProtectedRoute from "./protected-route"

const LoginPage = lazy(() => import("@/features/auth/login-page"))
const RegisterPage = lazy(() => import("@/features/auth/register-page"))

const HomePage = lazy(() => import("@/features/products/home-page"))
const CartPage = lazy(() => import("@/features/cart/cart-page"))

const OrdersPage = lazy(() => import("@/features/orders/orders-page"))
const OrderSuccess = lazy(() => import("@/features/orders/order-success"))

const ProfilePage = lazy(() => import("@/features/profile/profile-page"))

const PaymentPage = lazy(() => import("@/features/payment/payment-page"))

export default function AppRoutes() {

  return (

    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/cart" element={<CartPage />} />

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

        {/* PAYMENT PAGE */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />

      </Routes>

    </Suspense>

  )
}
