import axios from "axios"

const baseURL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000"

export const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

type RetryableRequestConfig = {
  _retry?: boolean
  headers?: Record<string, string>
}

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    return null
  }

  try {
    const res = await axios.post<{ accessToken: string }>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const nextAccessToken = res.data.accessToken

    localStorage.setItem("accessToken", nextAccessToken)

    return nextAccessToken
  } catch (error) {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    return null
  }
}

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    const nextAccessToken = await refreshPromise

    if (!nextAccessToken) {
      return Promise.reject(error)
    }

    originalRequest.headers = originalRequest.headers || {}
    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`

    return API(originalRequest)
  }
)
