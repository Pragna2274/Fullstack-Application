import { Request, Response } from "express"
import * as userService from "../services/user.service.js"

interface AuthRequest extends Request {
  userId?: string
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getProfile(req.userId!)
    res.json(user)
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body
    const user = await userService.updateProfile(req.userId!, name)
    res.json(user)
  } catch {
    res.status(500).json({ error: "Failed to update profile" })
  }
}