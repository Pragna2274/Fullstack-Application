import { API } from "@/api/axios"

export const getProducts = async (page = 1, limit = 10) => {
  const res = await API.get(`/products?page=${page}&limit=${limit}`)
  return res.data
}