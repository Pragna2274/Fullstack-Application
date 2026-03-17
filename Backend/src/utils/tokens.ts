import jwt from "jsonwebtoken"

const ACCESS_TOKEN_EXPIRY = "30m"
const REFRESH_TOKEN_EXPIRY = "7d"

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )
}