import { Router } from "express"
import { createPaymentIntent } from "../controllers/payment.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = Router()

router.post("/create-payment-intent", authenticate, createPaymentIntent)

export default router