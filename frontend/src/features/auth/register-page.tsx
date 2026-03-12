import { useState } from "react"
import { registerUser } from "./api"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {

    try {

      await registerUser({
        name,
        email,
        password
      })

      alert("Registration successful")

      navigate("/login")

    } catch (err: any) {

      alert(err.response?.data?.message || "Registration failed")

    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-40">

      <h1 className="text-2xl font-bold text-center">
        Register
      </h1>

      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleRegister}>
        Register
      </Button>

      <p className="text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </p>

    </div>
  )
}