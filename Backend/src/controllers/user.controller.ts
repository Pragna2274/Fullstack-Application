import { Request, Response } from "express"
import * as userService from "../services/user.service.js"
import { updateProfileSchema } from "../validations/user.validation.js"

interface AuthRequest extends Request {
  userId?: string
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const user = await userService.getProfile(userId)

    res.json(user)

  } catch (error) {

    res.status(500).json({ error: "Failed to fetch profile" })

  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const parsed = updateProfileSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const { name } = parsed.data

    const user = await userService.updateProfile(userId, name)

    res.json(user)

  } catch (error) {

    res.status(500).json({ error: "Failed to update profile" })

  }
}