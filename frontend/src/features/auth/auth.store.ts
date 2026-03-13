import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserProfile = {
  name: string
  email: string
  address: string
}

type AuthState = {
  currentUser: UserProfile | null
  profilesByEmail: Record<string, UserProfile>
  registerProfile: (profile: Omit<UserProfile, "address"> & { address?: string }) => void
  loginWithEmail: (email: string) => void
  updateAddress: (address: string) => void
  syncCurrentUserFromStorage: () => void
  logout: () => void
}

const createDefaultProfile = (email: string): UserProfile => ({
  name: email.split("@")[0] || "Feasta User",
  email,
  address: "",
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      profilesByEmail: {},

      registerProfile: (profile) =>
        set((state) => {
          const nextProfile: UserProfile = {
            name: profile.name,
            email: profile.email,
            address: profile.address || "",
          }

          return {
            profilesByEmail: {
              ...state.profilesByEmail,
              [profile.email]: nextProfile,
            },
          }
        }),

      loginWithEmail: (email) =>
        set((state) => {
          const profile = state.profilesByEmail[email] || createDefaultProfile(email)
          localStorage.setItem("feasta-current-user-email", email)

          return {
            currentUser: profile,
            profilesByEmail: {
              ...state.profilesByEmail,
              [email]: profile,
            },
          }
        }),

      updateAddress: (address) =>
        set((state) => {
          const currentUser = get().currentUser

          if (!currentUser) {
            return state
          }

          const nextProfile = {
            ...currentUser,
            address,
          }

          return {
            currentUser: nextProfile,
            profilesByEmail: {
              ...state.profilesByEmail,
              [currentUser.email]: nextProfile,
            },
          }
        }),

      syncCurrentUserFromStorage: () =>
        set((state) => {
          if (state.currentUser) {
            return state
          }

          const email = localStorage.getItem("feasta-current-user-email")

          if (!email) {
            return state
          }

          const profile = state.profilesByEmail[email] || createDefaultProfile(email)

          return {
            currentUser: profile,
            profilesByEmail: {
              ...state.profilesByEmail,
              [email]: profile,
            },
          }
        }),

      logout: () =>
        set(() => {
          localStorage.removeItem("feasta-current-user-email")

          return {
            currentUser: null,
          }
        }),
    }),
    {
      name: "feasta-auth-store",
    }
  )
)
