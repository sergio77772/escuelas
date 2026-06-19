import React from 'react'
import { Student, Attendance } from '@/lib/types'
import { Save } from 'lucide-react'

interface AttendanceTableProps {
  students: Student[]
  loading: boolean
  saving: boolean
  draftStatuses: Record<string, Attendance['status']>
  handleStatusChange: (studentId: string, status: Attendance['status']) => void
  handleSave: () => void
}

export function AttendanceTable({
  students,
  loading,
  saving,
  draftStatuses,
  handleStatusChange,
  handleSave
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          {students.length} Alumnos listados
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{saving ? 'Guardando...' : 'Guardar Asistencias'}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Cargando alumnos...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Alumno</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-sm w-64">Estado de Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.last_name}, {student.first_name}</div>
                    <div className="text-sm text-gray-500">DNI: {student.dni || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={draftStatuses[student.id] || 'present'}
                      onChange={(e) => handleStatusChange(student.id, e.target.value as Attendance['status'])}
                      className={`w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-medium py-2 ${
                        draftStatuses[student.id] === 'present' ? 'text-green-700 bg-green-50' :
                        draftStatuses[student.id] === 'absent' ? 'text-red-700 bg-red-50' :
                        draftStatuses[student.id] === 'late' ? 'text-orange-700 bg-orange-50' : 'text-blue-700 bg-blue-50'
                      }`}
                    >
                      <option value="present">Presente</option>
                      <option value="absent">Ausente</option>
                      <option value="late">Tarde</option>
                      <option value="justified">Ausente Justificado</option>
                    </select>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                    No hay alumnos inscriptos en esta división.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
