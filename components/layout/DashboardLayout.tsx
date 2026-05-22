'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { userService, establishmentService } from '@/lib/services/supabase'
import Sidebar from '@/components/layout/Sidebar'
import { LogOut } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)
  const { user, establishment, setUser, setEstablishment, setLoading, isLoading } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = createClient()
        
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          if (pathname !== '/login' && pathname !== '/signup') {
            router.push('/login')
          }
          setIsInitialized(true)
          setLoading(false)
          return
        }

        // Obtener datos del usuario desde la base de datos
        const appUser = await userService.getByAuthId(session.user.id)
        
        if (!appUser) {
          router.push('/login')
          setIsInitialized(true)
          setLoading(false)
          return
        }

        // Obtener datos del establecimiento
        const est = await establishmentService.getById(appUser.establishment_id)
        
        setUser({
          id: appUser.id,
          email: appUser.email,
          full_name: appUser.full_name,
          role: appUser.role,
          establishment_id: appUser.establishment_id,
          auth_id: appUser.auth_id || '',
        })

        if (est) {
          setEstablishment({
            id: est.id,
            name: est.name,
            plan: est.plan,
            subscription_status: est.subscription_status,
          })
        }

        setIsInitialized(true)
        setLoading(false)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setIsInitialized(true)
        setLoading(false)
      }
    }

    if (!isInitialized) {
      initializeAuth()
    }
  }, [isInitialized, router, pathname, setUser, setEstablishment, setLoading])

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/login' || pathname === '/signup') {
    return children
  }

  if (!user || !establishment) {
    return null
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    useAuthStore.getState().logout()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} establishment={establishment} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
