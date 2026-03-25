import { API } from "@/api/axios"

export const getProducts = async (page = 1, limit = 10) => {
  const res = await API.get(`/products?page=${page}&limit=${limit}`)
  return res.data
}

export const getProductById = async (id: string) => {
  const res = await API.get(`/products/${id}`)
  return res.data
}
