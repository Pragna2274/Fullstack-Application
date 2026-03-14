import { Router } from "express"
import {
  confirmPayment,
  createPaymentIntent,
  getStripeConfig,
} from "../controllers/payment.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = Router()

router.get("/config", getStripeConfig)
router.post("/create-payment-intent", authenticate, createPaymentIntent)
router.post("/confirm", authenticate, confirmPayment)

export default router
