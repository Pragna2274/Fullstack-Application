import { stripe } from "../lib/stripe.js"

export const createPaymentIntent = async (amount: number) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true
    }
  })

  return paymentIntent
}