import { useState } from "react"
import { loginUser } from "./api"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {

      const res = await loginUser({ email, password })

      localStorage.setItem("accessToken", res.accessToken)

      navigate("/")

    } catch (err: any) {

      alert(err.response?.data?.message || "Login failed")

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

      <Button onClick={handleLogin}>
        Login
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