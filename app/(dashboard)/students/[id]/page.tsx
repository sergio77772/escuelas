'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { studentService, guardianService, gradeService, attendanceService } from '@/lib/services/supabase'
import { Student, Guardian, Grade, Attendance } from '@/lib/types'
import { 
  UserCircle2, Phone, Mail, MapPin, Calendar, 
  Activity, Users, FileText, Clock, ChevronLeft,
  AlertCircle
} from 'lucide-react'

type TabType = 'personal' | 'family' | 'grades' | 'attendance'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  const { user } = useAuthStore()

  const [student, setStudent] = useState<Student | null>(null)
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [grades, setGrades] = useState<any[]>([]) // Using any to handle joined subjects
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('personal')

  useEffect(() => {
    async function loadData() {
      if (!studentId || !user) return

      try {
        const [studentData, guardianData, gradeData, attendanceData] = await Promise.all([
          studentService.getById(studentId),
          guardianService.getByStudent(studentId),
          gradeService.getByStudent(studentId),
          attendanceService.getByStudent(studentId)
        ])

        setStudent(studentData)
        setGuardians(guardianData)
        setGrades(gradeData)
        setAttendances(attendanceData)
      } catch (err) {
        console.error('Error loading student profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [studentId, user])

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  if (!student) {
    return <div className="p-12 text-center text-gray-500">Alumno no encontrado.</div>
  }

  // Calculate stats
  const totalClasses = attendances.length
  const presents = attendances.filter(a => a.status === 'present').length
  const attendanceRate = totalClasses > 0 ? Math.round((presents / totalClasses) * 100) : 100

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Volver a la lista</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="flex items-end space-x-6">
              <div className="bg-white p-2 rounded-2xl shadow-md">
                {student.photo_url ? (
                  <img src={student.photo_url} alt="Profile" className="w-28 h-28 rounded-xl object-cover" />
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                    <UserCircle2 size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-900">{student.first_name} {student.last_name}</h1>
                <p className="text-gray-500 text-lg">DNI: {student.dni || 'No registrado'}</p>
              </div>
            </div>
            <div className="pb-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {student.status === 'active' ? 'Activo Regular' : student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex space-x-2">
        <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<UserCircle2 size={18}/>} label="Datos Personales" />
        <TabButton active={activeTab === 'family'} onClick={() => setActiveTab('family')} icon={<Users size={18}/>} label="Familia & Tutores" />
        <TabButton active={activeTab === 'grades'} onClick={() => setActiveTab('grades')} icon={<FileText size={18}/>} label="Calificaciones" />
        <TabButton active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={<Clock size={18}/>} label="Asistencias" />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Información de Contacto</h3>
              <InfoRow icon={<Phone size={18}/>} label="Teléfono" value={student.phone || 'No registrado'} />
              <InfoRow icon={<Mail size={18}/>} label="Correo Electrónico" value={student.email || 'No registrado'} />
              <InfoRow icon={<MapPin size={18}/>} label="Dirección" value={student.address || 'No registrado'} />
              <InfoRow icon={<Calendar size={18}/>} label="Fecha Nacimiento" value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('es-AR') : 'No registrado'} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center">
                <Activity className="mr-2 text-red-500" size={20}/> 
                Ficha Médica
              </h3>
              <InfoRow icon={null} label="Grupo Sanguíneo" value={student.blood_type || 'No especificado'} />
              <div>
                <label className="text-sm text-gray-500 font-medium block mb-2">Información Médica Importante (Alergias, etc.)</label>
                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100 min-h-[100px]">
                  {student.medical_info ? student.medical_info : <span className="text-gray-400 italic">Sin observaciones médicas.</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {guardians.length === 0 ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Users size={48} className="text-gray-300 mb-4" />
                <p>No hay tutores registrados para este alumno.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Tutor</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Vínculo</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Contacto</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm text-center">Contacto Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guardians.map(g => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{g.full_name}</td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{g.relationship}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex flex-col space-y-1">
                          {g.phone && <span className="flex items-center text-sm"><Phone size={14} className="mr-2"/> {g.phone}</span>}
                          {g.email && <span className="flex items-center text-sm"><Mail size={14} className="mr-2"/> {g.email}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {g.primary_contact && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Principal</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {grades.length === 0 ? (
               <div className="p-12 text-center text-gray-500">No hay calificaciones registradas.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Materia</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Período</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Nota</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grades.map(g => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{g.subjects?.name || 'Materia Desconocida'}</td>
                      <td className="px-6 py-4 text-gray-600">{g.period}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{g.grade || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          g.status === 'approved' ? 'bg-green-100 text-green-800' :
                          g.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {g.status === 'approved' ? 'Aprobado' : g.status === 'failed' ? 'Desaprobado' : g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Clock size={24}/></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Asistencia Perfecta</p>
                  <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full"><AlertCircle size={24}/></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Clases Presente</p>
                  <p className="text-2xl font-bold text-gray-900">{presents}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-full"><AlertCircle size={24}/></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Inasistencias Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClasses - presents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {attendances.length === 0 ? (
                 <div className="p-12 text-center text-gray-500">No hay registros de asistencia.</div>
               ) : (
                 <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Fecha</th>
                      <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Materia</th>
                      <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendances.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">{new Date(a.attendance_date).toLocaleDateString('es-AR')}</td>
                        <td className="px-6 py-4 text-gray-600">{a.subjects?.name || 'General'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            a.status === 'present' ? 'bg-green-100 text-green-800' :
                            a.status === 'absent' ? 'bg-red-100 text-red-800' :
                            a.status === 'late' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {a.status === 'present' ? 'Presente' : a.status === 'absent' ? 'Ausente' : a.status === 'late' ? 'Tarde' : 'Justificado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-4">
      {icon && <div className="text-gray-400">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  )
}
