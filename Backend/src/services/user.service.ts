import { prisma } from "../lib/prisma.js"

export const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  })
}

export const updateProfile = async (
  userId: string,
  name: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { name }
  })
}