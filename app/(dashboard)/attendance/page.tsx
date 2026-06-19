'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import {
  academicYearService,
  divisionService,
  subjectService,
  studentService,
  attendanceService
} from '@/lib/services/supabase'
import { AcademicYear, Division, Subject, Student, Attendance } from '@/lib/types'
import { AttendanceFilters } from './components/AttendanceFilters'
import { AttendanceTable } from './components/AttendanceTable'
import { AlertMessage } from '@/components/ui/AlertMessage'

export default function AttendancePage() {
  const { user, establishment } = useAuthStore()
  
  // Master data
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  
  // Selected IDs
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [selectedDivId, setSelectedDivId] = useState<string>('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  // View data
  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<Record<string, Attendance>>({})
  
  // Local modifications
  const [draftStatuses, setDraftStatuses] = useState<Record<string, Attendance['status']>>({})

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 1. Load Academic Years
  useEffect(() => {
    if (!user?.establishment_id) return
    academicYearService.getByEstablishment(user.establishment_id).then(data => {
      setAcademicYears(data)
      if (data.length > 0) setSelectedYearId(data[0].id)
    })
  }, [user])

  // 2. Load Divisions when Year changes
  useEffect(() => {
    if (!selectedYearId) {
      setDivisions([])
      return
    }
    divisionService.getByAcademicYear(selectedYearId).then(setDivisions)
  }, [selectedYearId])

  // 3. Load Subjects and Students when Division changes
  useEffect(() => {
    if (!selectedDivId || !selectedYearId) {
      setSubjects([])
      setStudents([])
      return
    }
    subjectService.getByAcademicYear(selectedYearId).then(setSubjects)
    studentService.getByDivision(selectedDivId).then(setStudents)
  }, [selectedDivId, selectedYearId])

  // 4. Load Attendances when Subject and Date are selected
  useEffect(() => {
    if (!selectedSubjectId || !selectedDate || students.length === 0) {
      setAttendances({})
      setDraftStatuses({})
      return
    }

    setLoading(true)
    attendanceService.getBySubjectAndDate(selectedSubjectId, selectedDate).then(data => {
      const attendanceMap: Record<string, Attendance> = {}
      const statusMap: Record<string, Attendance['status']> = {}

      data.forEach(a => {
        attendanceMap[a.student_id] = a
        statusMap[a.student_id] = a.status
      })

      // Set default 'present' for students without a record yet in draft
      students.forEach(s => {
        if (!statusMap[s.id]) {
          statusMap[s.id] = 'present'
        }
      })

      setAttendances(attendanceMap)
      setDraftStatuses(statusMap)
      setLoading(false)
    })
  }, [selectedSubjectId, selectedDate, students])

  const handleStatusChange = (studentId: string, status: Attendance['status']) => {
    setError('')
    setSuccess('')
    setDraftStatuses(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    if (!selectedSubjectId || !selectedDate || !user?.id) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updates: Partial<Attendance>[] = students.map(student => {
        const existingAttendance = attendances[student.id]
        const statusValue = draftStatuses[student.id]

        return {
          id: existingAttendance?.id,
          student_id: student.id,
          subject_id: selectedSubjectId,
          attendance_date: selectedDate,
          status: statusValue,
          recorded_by: user.id
        }
      })

      if (updates.length === 0) {
        setSaving(false)
        return
      }

      const success = await attendanceService.upsertMany(updates)
      if (success) {
        setSuccess('Asistencias guardadas exitosamente.')
        const newAttendances = await attendanceService.getBySubjectAndDate(selectedSubjectId, selectedDate)
        const attendanceMap: Record<string, Attendance> = {}
        newAttendances.forEach(a => { attendanceMap[a.student_id] = a })
        setAttendances(attendanceMap)
      } else {
        setError('Ocurrió un error al guardar las asistencias.')
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Asistencias</h1>
        <p className="text-gray-600 mt-2">Registro de asistencia diaria por materia y división.</p>
      </div>

      <AttendanceFilters
        academicYears={academicYears}
        divisions={divisions}
        subjects={subjects}
        selectedYearId={selectedYearId}
        setSelectedYearId={setSelectedYearId}
        selectedDivId={selectedDivId}
        setSelectedDivId={setSelectedDivId}
        selectedSubjectId={selectedSubjectId}
        setSelectedSubjectId={setSelectedSubjectId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {selectedSubjectId && selectedDate && selectedDivId ? (
        <AttendanceTable
          students={students}
          loading={loading}
          saving={saving}
          draftStatuses={draftStatuses}
          handleStatusChange={handleStatusChange}
          handleSave={handleSave}
        />
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500 font-medium">
            Selecciona Ciclo Lectivo, División, Materia y Fecha para registrar las asistencias.
          </p>
        </div>
      )}
    </div>
  )
}
