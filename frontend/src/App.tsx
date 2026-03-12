import Navbar from "@/components/layout/navbar"
import AppRoutes from "@/routes/app-routes"
import { useLocation } from "react-router-dom"

export default function App() {

  const location = useLocation()

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