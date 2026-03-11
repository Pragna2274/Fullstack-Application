import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import * as cartController from "../controllers/cart.controller.js"

const router = Router()

router.post("/add", authenticate, cartController.addItem)

router.get("/", authenticate, cartController.getUserCart)

router.put("/item/:id", authenticate, cartController.updateItem)

router.delete("/item/:id", authenticate, cartController.deleteItem)

export default router