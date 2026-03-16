import { useState } from "react"
import { isAxiosError } from "axios"
import { loginUser } from "./api"
import { useAuthStore } from "./auth.store"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {

  const navigate = useNavigate()
  const location = useLocation()
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo =
    typeof location.state === "object" &&
    location.state &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/"

  const handleLogin = async () => {
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const res = await loginUser({ email, password })

      localStorage.setItem("accessToken", res.accessToken)
      localStorage.setItem("refreshToken", res.refreshToken)
      setCurrentUser({
        name: res.user.name,
        email: res.user.email,
        address: "",
      })

      navigate(redirectTo)

    } catch (err: unknown) {
      const rawMessage = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Login failed"

      const message =
        typeof rawMessage === "string" &&
        rawMessage.includes("Unique constraint failed on the fields: (`token`)")
          ? "Login could not be completed right now. Please wait a moment and try again once."
          : rawMessage

      alert(message)
    } finally {
      setIsSubmitting(false)

    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-40">

      <h1 className="text-2xl font-bold text-center">
        Login
      </h1>

      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Register
        </Link>
      </p>

    </div>
  )
}
