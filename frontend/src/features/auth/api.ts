import { API } from "@/api/axios"

export const registerUser = async (data: {
  name: string
  email: string
  password: string
}) => {
  const res = await API.post("/auth/register", data)
  return res.data
}

export const loginUser = async (data: {
  email: string
  password: string
}) => {
  const res = await API.post("/auth/login", data)
  return res.data
}
export const logoutUser = async () => {

  const refreshToken = localStorage.getItem("refreshToken")

  await API.post("/auth/logout", { refreshToken })

  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}