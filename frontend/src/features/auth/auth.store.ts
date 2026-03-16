import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type UserProfile = {
  name: string
  email: string
  address: string
}

type AuthState = {
  currentUser: UserProfile | null
  setCurrentUser: (profile: Omit<UserProfile, "address"> & { address?: string }) => void
  updateAddress: (address: string) => void
  syncCurrentUserFromStorage: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      setCurrentUser: (profile) =>
        set(() => {
          const nextProfile: UserProfile = {
            name: profile.name,
            email: profile.email,
            address: profile.address || "",
          }

          return {
            currentUser: nextProfile,
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
          }
        }),

      syncCurrentUserFromStorage: () =>
        set((state) => {
          if (state.currentUser) {
            return state
          }

          return state
        }),

      logout: () =>
        set(() => {
          return {
            currentUser: null,
          }
        }),
    }),
    {
      name: "feasta-auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
)
