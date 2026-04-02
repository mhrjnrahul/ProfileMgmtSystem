import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type { AuthState, AuthResponse } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        user: null,
        isAuthenticated: false,

        setUser: (user: AuthResponse) => set({ user, isAuthenticated: true }),

        logout: () => set({ user: null, isAuthenticated: false }),
    }), {
        name: 'auth-storage',
    })
)