import { API } from "@/api/axios"

export const getProducts = async () => {

  const res = await API.get("/products")

  return res.data
}