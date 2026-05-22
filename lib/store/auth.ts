import { create } from 'zustand'

export interface User {
  id: string
  email: string
  full_name: string
  role: 'director' | 'secretario' | 'docente' | 'preceptor' | 'padre' | 'alumno' | 'tecnico'
  establishment_id: string
  auth_id: string
}

export interface Establishment {
  id: string
  name: string
  plan: 'modelo_a' | 'modelo_b'
  subscription_status: 'active' | 'suspended'
}

interface AuthStore {
  user: User | null
  establishment: Establishment | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setEstablishment: (establishment: Establishment | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  establishment: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setEstablishment: (establishment) => set({ establishment }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, establishment: null }),
}))
