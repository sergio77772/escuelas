'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { User, Establishment } from '@/lib/store/auth'

interface SidebarProps {
  user: User
  establishment: Establishment
  onLogout: () => void
}

export default function Sidebar({ user, establishment, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['director', 'secretario', 'docente', 'preceptor'] },
    { href: '/students', label: 'Alumnos', icon: Users, roles: ['director', 'secretario'] },
    { href: '/grades', label: 'Notas', icon: BookOpen, roles: ['director', 'secretario', 'docente'] },
    { href: '/attendance', label: 'Asistencias', icon: ClipboardList, roles: ['director', 'secretario', 'docente', 'preceptor'] },
    { href: '/reports', label: 'Reportes', icon: BarChart3, roles: ['director', 'secretario'] },
    { href: '/settings', label: 'Configuración', icon: Settings, roles: ['director'] },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role))

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-white shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static md:translate-x-0 top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg transition-transform duration-300 z-30 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">GesEscolar</h1>
          <p className="text-blue-200 text-sm mt-1">{establishment.name}</p>
          <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
            establishment.plan === 'modelo_a' 
              ? 'bg-green-500 text-white' 
              : 'bg-orange-500 text-white'
          }`}>
            {establishment.plan === 'modelo_a' ? 'Modelo Completo' : 'Modelo Institucional'}
          </span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-blue-700 mx-4 my-4 rounded-lg bg-blue-700 bg-opacity-50">
          <p className="text-sm text-blue-100">Rol:</p>
          <p className="font-semibold text-white capitalize">{user.role}</p>
          <p className="text-xs text-blue-200 mt-2">{user.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          <button
            onClick={() => {
              onLogout()
              setIsOpen(false)
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
