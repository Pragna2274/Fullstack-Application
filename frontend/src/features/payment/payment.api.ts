import { API } from "@/api/axios"

type CreatePaymentIntentResponse = {
  orderId?: string | null
  amount?: number | null
  clientSecret?: string | null
}

type ConfirmPaymentResponse = {
  success: boolean
}

type StripeConfigResponse = {
  publishableKey?: string | null
}

export const getStripeConfig = async () => {
  const res = await API.get<StripeConfigResponse>("/payment/config")

  if (!res.data.publishableKey) {
    throw new Error("Stripe publishable key was not returned by the server.")
  }

  return {
    publishableKey: res.data.publishableKey,
  }
}

export const createPaymentIntent = async () => {
  const res = await API.post<CreatePaymentIntentResponse>(
    "/payment/create-payment-intent"
  )

  if (!res.data.clientSecret || !res.data.orderId || typeof res.data.amount !== "number") {
    throw new Error("Payment details were not returned by the server.")
  }

  return {
    orderId: res.data.orderId,
    amount: res.data.amount,
    clientSecret: res.data.clientSecret,
  }
}

export const confirmPayment = async (orderId: string, paymentIntentId: string) => {
  const res = await API.post<ConfirmPaymentResponse>("/payment/confirm", {
    orderId,
    paymentIntentId,
  })

  return res.data
}
