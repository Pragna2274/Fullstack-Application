import express from "express"
import cors from "cors"


const app = express()

app.use(express.json())


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)

app.get("/", (req, res) => {
  res.json({ message: "API running" })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})