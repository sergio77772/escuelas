'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { BarChart3, Users, BookOpen, GraduationCap, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ReportsPage() {
  const { user, establishment } = useAuthStore()
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    divisions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user?.establishment_id) return
      
      const supabase = createClient()

      const [
        { count: studentsCount },
        { count: teachersCount },
        { count: subjectsCount },
        { count: divisionsCount }
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('establishment_id', user.establishment_id),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('establishment_id', user.establishment_id).eq('role', 'docente'),
        supabase.from('subjects').select('*', { count: 'exact', head: true }).eq('establishment_id', user.establishment_id),
        supabase.from('divisions').select('id, academic_years!inner(establishment_id)', { count: 'exact', head: true }).eq('academic_years.establishment_id', user.establishment_id)
      ])

      setStats({
        students: studentsCount || 0,
        teachers: teachersCount || 0,
        subjects: subjectsCount || 0,
        divisions: divisionsCount || 0
      })
      setLoading(false)
    }

    loadStats()
  }, [user])

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Cargando reportes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes Generales</h1>
          <p className="text-gray-600 mt-1">Estadísticas y resumen de la institución: {establishment?.name}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Alumnos Totales" 
          value={stats.students} 
          icon={<GraduationCap size={24} />} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
          title="Plantel Docente" 
          value={stats.teachers} 
          icon={<Users size={24} />} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Divisiones Activas" 
          value={stats.divisions} 
          icon={<CalendarDays size={24} />} 
          color="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Materias Dictadas" 
          value={stats.subjects} 
          icon={<BookOpen size={24} />} 
          color="bg-rose-50 text-rose-600" 
        />
      </div>

      {/* Main Charts Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-80 items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <BarChart3 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Evolución de Asistencia</h3>
          <p className="text-gray-500 mt-2">Módulo de gráficos en desarrollo.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-80 items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <BarChart3 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Rendimiento Académico</h3>
          <p className="text-gray-500 mt-2">Módulo de gráficos en desarrollo.</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  )
}
