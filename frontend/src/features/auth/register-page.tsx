import { useState } from "react"
import { isAxiosError } from "axios"
import { registerUser } from "./api"
import { useAuthStore } from "./auth.store"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {

  const navigate = useNavigate()
  const registerProfile = useAuthStore((state) => state.registerProfile)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

 const handleRegister = async () => {
  if (isSubmitting) {
    return
  }

  try {
    setIsSubmitting(true)

    await registerUser({
      name,
      email,
      password
    })

    registerProfile({
      name,
      email,
    })

    alert("Registration successful")

    navigate("/login")

  } catch (err: unknown) {
    const rawMessage = isAxiosError(err)
      ? err.response?.data?.message || err.message
      : "Registration failed"

    const message =
      typeof rawMessage === "string" &&
      rawMessage.includes("Unique constraint failed on the fields: (`token`)")
        ? "Registration completed with a server token conflict. Please wait a moment and try again once."
        : rawMessage

    alert(message)
  } finally {
    setIsSubmitting(false)

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

      <Button onClick={handleRegister} disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Register"}
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
