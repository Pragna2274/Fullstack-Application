import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import * as orderController from "../controllers/order.controller.js"

const router = Router()

router.post("/place", authenticate, orderController.placeOrder)

router.get("/", authenticate, orderController.getOrders)

router.get("/:id", authenticate, orderController.getOrder)

export default router