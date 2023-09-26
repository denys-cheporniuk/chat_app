import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "../gql/graphql"

interface UserState {
  id?: number
  email: string
  fullname: string
  avatarUrl: string | null
  updateProfileImage: (image: string) => void
  updateUserName: (name: string) => void
  setUser: (user: User) => void
}


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: undefined,
      fullname: "",
      email: "",
      avatarUrl: null,

      updateProfileImage: (image: string) => set({ avatarUrl: image }),
      updateUserName: (name: string) => set({ fullname: name }),
      setUser: (user) =>
        set({
          id: user.id,
          avatarUrl: user.avatarUrl,
          fullname: user.fullname,
          email: user.email,
        }),
    }),
    {
      name: "user-store",
    }
  )
)
