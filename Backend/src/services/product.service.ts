import { prisma } from "../lib/prisma.js"

export const getProducts = async (
  search?: string,
  category?: string,
  page: number = 1,
  limit: number = 10
) => {

  const skip = (page - 1) * limit

  return prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive"
              }
            }
          : {}
      ]
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    }
  })
}

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id }
  })
}

export const createProduct = async (data: any) => {
  return prisma.product.create({
    data
  })
}

export const updateProduct = async (id: string, data: any) => {
  return prisma.product.update({
    where: { id },
    data
  })
}

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id }
  })
}