import { Request, Response } from "express"
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../services/auth.service.js"
import { registerSchema, loginSchema } from "../validations/auth.validation.js"

export const register = async (req: Request, res: Response) => {

  const parsed = registerSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  const user = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password)

  res.json(user)
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const result = await loginUser(email, password)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    const accessToken = await refreshAccessToken(refreshToken)

    res.json({ accessToken })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    const result = await logoutUser(refreshToken)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}