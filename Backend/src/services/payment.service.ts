import { stripe } from "../lib/stripe.js"

export const createPaymentIntent = async (
  amount: number,
  metadata?: Record<string, string>
) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    metadata,
    automatic_payment_methods: {
      enabled: true
    }
  })

  return paymentIntent
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}
