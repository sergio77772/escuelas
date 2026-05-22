'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { studentService } from '@/lib/services/supabase'
import { Student } from '@/lib/types'
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function StudentsPage() {
  const { user, establishment } = useAuthStore()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStudents()
  }, [user])

  useEffect(() => {
    const filtered = students.filter(student =>
      `${student.first_name} ${student.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (student.dni && student.dni.includes(searchTerm))
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const loadStudents = async () => {
    if (!user?.establishment_id) return

    try {
      const data = await studentService.getByEstablishment(user.establishment_id)
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este alumno?')) return

    try {
      const success = await studentService.delete(id)
      if (success) {
        setStudents(students.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumnos</h1>
          <p className="text-gray-600 mt-2">Gestiona el legajo digital de los alumnos</p>
        </div>
        <Link
          href="/students/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Alumno</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, apellido o DNI..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">DNI</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha Nacimiento</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.dni || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString('es-AR')
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : student.status === 'graduated'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status === 'active' ? 'Activo' : 
                     student.status === 'graduated' ? 'Egresado' : 
                     student.status === 'withdrawn' ? 'Retirado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-3 flex justify-end">
                  <Link
                    href={`/students/${student.id}`}
                    className="text-blue-600 hover:text-blue-700"
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/students/${student.id}/edit`}
                    className="text-orange-600 hover:text-orange-700"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600">No se encontraron alumnos</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Alumnos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Alumnos Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {students.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Egresados</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {students.filter(s => s.status === 'graduated').length}
          </p>
        </div>
      </div>
    </div>
  )
}
