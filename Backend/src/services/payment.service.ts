import { stripe } from "../lib/stripe.js"

const toPaise = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Payment amount must be a positive number")
  }

  return Math.round(amount * 100)
}

export const createPaymentIntent = async (
  amount: number,
  metadata?: Record<string, string>
) => {
  const amountInPaise = toPaise(amount)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",
    metadata,
    automatic_payment_methods: {
      enabled: true
    }
  })

  console.log("[stripe] payment intent created", {
    amount,
    amountInPaise,
    paymentIntentId: paymentIntent.id,
    metadata,
  })

  return paymentIntent
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}
