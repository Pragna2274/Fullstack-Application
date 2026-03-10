import "dotenv/config"

import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Feasta API running 🚀")
})

app.use("/auth", authRoutes)

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})