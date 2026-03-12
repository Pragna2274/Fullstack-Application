import { API } from "@/api/axios"

export const createCheckoutSession = async (orderId: string) => {

  const res = await API.post("/payment/checkout", {
    orderId
  })

  return res.data
}