import { useState } from "react"
import { isAxiosError } from "axios"
import { registerUser } from "./api"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getRegisterValidationMessage = ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  if (!name.trim()) {
    return "Name is required"
  }

  if (!email.trim()) {
    return "Email is required"
  }

  if (!emailPattern.test(email.trim())) {
    return "Invalid email"
  }

  if (!password) {
    return "Password is required"
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters"
  }

  return null
}

export default function RegisterPage() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async () => {
    if (isSubmitting) {
      return
    }

    const validationMessage = getRegisterValidationMessage({
      name,
      email,
      password,
    })

    if (validationMessage) {
      alert(validationMessage)
      return
    }

    try {
      setIsSubmitting(true)

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      alert("Registration successful")

      navigate("/login")
    } catch (err: unknown) {
      const rawMessage = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Registration failed"

      const normalizedMessage = Array.isArray(rawMessage)
        ? rawMessage.find(
            (item): item is { message?: string } =>
              typeof item === "object" &&
              item !== null &&
              "message" in item &&
              typeof item.message === "string",
          )?.message || "Registration failed"
        : rawMessage

      const message =
        typeof normalizedMessage === "string" &&
        normalizedMessage.includes("Unique constraint failed on the fields: (`token`)")
          ? "Registration completed with a server token conflict. Please wait a moment and try again once."
          : normalizedMessage

      alert(typeof message === "string" ? message : "Registration failed")
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
