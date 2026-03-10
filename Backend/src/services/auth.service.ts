import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js"

const SALT_ROUNDS = 10

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return user
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    throw new Error("Invalid credentials")
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return {
    user,
    accessToken,
    refreshToken
  }
}

export const refreshAccessToken = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token }
  })

  if (!storedToken) {
    throw new Error("Invalid refresh token")
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired")
  }

  const accessToken = generateAccessToken(storedToken.userId)

  return accessToken
}

export const logoutUser = async (token: string) => {
  await prisma.refreshToken.delete({
    where: { token }
  })

  return { message: "Logged out successfully" }
}