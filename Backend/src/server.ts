import "dotenv/config"

import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import { authenticate } from "./middleware/auth.middleware.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Feasta API running 🚀")
})

app.use("/auth", authRoutes)

app.use("/products", productRoutes)

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access granted" })
})

app.use("/cart", cartRoutes)

app.use("/orders", orderRoutes)


const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})