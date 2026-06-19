'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { studentService, gradeService, attendanceService, academicYearService } from '@/lib/services/supabase'
import { Student, Grade, Attendance, AcademicYear } from '@/lib/types'
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, establishment } = useAuthStore()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGrades: 0,
    totalAttendances: 0,
    academicYears: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.establishment_id) return

      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        const [
          { count: studentsCount },
          { count: gradesCount },
          { count: attendancesCount },
          { count: yearsCount }
        ] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }).eq('establishment_id', user.establishment_id),
          supabase.from('grades').select('id, students!inner(establishment_id)', { count: 'exact', head: true }).eq('students.establishment_id', user.establishment_id),
          supabase.from('attendances').select('id, students!inner(establishment_id)', { count: 'exact', head: true }).eq('students.establishment_id', user.establishment_id),
          supabase.from('academic_years').select('*', { count: 'exact', head: true }).eq('establishment_id', user.establishment_id)
        ])

        setStats({
          totalStudents: studentsCount || 0,
          totalGrades: gradesCount || 0,
          totalAttendances: attendancesCount || 0,
          academicYears: yearsCount || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Bienvenido, {user?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-gray-600 mt-2">
          {establishment?.name} • {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Alumnos"
          value={stats.totalStudents}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          label="Notas Cargadas"
          value={stats.totalGrades}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Registros Asistencia"
          value={stats.totalAttendances}
          color="orange"
        />
        <StatCard
          icon={Calendar}
          label="Años Académicos"
          value={stats.academicYears}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'director' || user?.role === 'secretario' ? (
            <>
              <QuickActionButton
                href="/students/new"
                icon={Users}
                label="Nuevo Alumno"
              />
              <QuickActionButton
                href="/grades/upload"
                icon={BookOpen}
                label="Cargar Notas"
              />
              <QuickActionButton
                href="/attendance/record"
                icon={Clock}
                label="Registrar Asistencia"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Info Box */}
      {establishment?.plan === 'modelo_a' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✓ Plan Completo Activo
          </h3>
          <p className="text-green-800">
            Tu establecimiento tiene acceso a todas las funcionalidades incluidas:
            portal de padres, notificaciones por email, y comunicados institucionales.
          </p>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number }>
  label: string
  value: number
  color: 'blue' | 'green' | 'orange' | 'purple'
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={32} />
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  href: string
  icon: React.ComponentType<{ size: number }>
  label: string
}

function QuickActionButton({ href, icon: Icon, label }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
    >
      <Icon size={24} />
      <span>{label}</span>
    </a>
  )
}
