import axios from "axios"

const baseURL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000"

export const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
