import axios from "axios"

export const API = axios.create({
  baseURL: "https://fullstack-application-1-dv3a.onrender.com"
})

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})