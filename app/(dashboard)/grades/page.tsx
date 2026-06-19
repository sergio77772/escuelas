'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import {
  academicYearService,
  divisionService,
  subjectService,
  gradingPeriodService,
  studentService,
  gradeService
} from '@/lib/services/supabase'
import { AcademicYear, Division, Subject, GradingPeriod, Student, Grade } from '@/lib/types'
import { GradesFilters } from './components/GradesFilters'
import { GradesTable } from './components/GradesTable'
import { AlertMessage } from '@/components/ui/AlertMessage'

export default function GradesPage() {
  const { user, establishment } = useAuthStore()
  
  // Master data
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [periods, setPeriods] = useState<GradingPeriod[]>([])
  
  // Selected IDs
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [selectedDivId, setSelectedDivId] = useState<string>('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedPeriodName, setSelectedPeriodName] = useState<string>('')

  // View data
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<string, Grade>>({}) // Map student_id -> Grade object
  
  // Local modifications
  const [draftGrades, setDraftGrades] = useState<Record<string, number | ''>>({})
  const [draftStatuses, setDraftStatuses] = useState<Record<string, Grade['status']>>({})

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

  // 2. Load Divisions & Periods when Year changes
  useEffect(() => {
    if (!selectedYearId) {
      setDivisions([])
      setPeriods([])
      return
    }
    divisionService.getByAcademicYear(selectedYearId).then(setDivisions)
    gradingPeriodService.getByAcademicYear(selectedYearId).then(setPeriods)
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

  // 4. Load Grades when Subject and Period are selected
  useEffect(() => {
    if (!selectedSubjectId || !selectedPeriodName || students.length === 0) {
      setGrades({})
      setDraftGrades({})
      setDraftStatuses({})
      return
    }

    setLoading(true)
    gradeService.getBySubject(selectedSubjectId).then(allGrades => {
      // Filter by period
      const periodGrades = allGrades.filter(g => g.period === selectedPeriodName)
      
      const gradesMap: Record<string, Grade> = {}
      const draftMap: Record<string, number | ''> = {}
      const statusMap: Record<string, Grade['status']> = {}

      periodGrades.forEach(g => {
        gradesMap[g.student_id] = g
        draftMap[g.student_id] = g.grade ?? ''
        statusMap[g.student_id] = g.status
      })

      setGrades(gradesMap)
      setDraftGrades(draftMap)
      setDraftStatuses(statusMap)
      setLoading(false)
    })
  }, [selectedSubjectId, selectedPeriodName, students])

  const handleGradeChange = (studentId: string, val: string) => {
    setError('')
    setSuccess('')
    let numVal: number | '' = ''
    if (val !== '') {
      numVal = parseFloat(val)
      if (isNaN(numVal) || numVal < 1 || numVal > 10) return // Basic frontend validation
    }
    setDraftGrades(prev => ({ ...prev, [studentId]: numVal }))
  }

  const handleStatusChange = (studentId: string, status: Grade['status']) => {
    setDraftStatuses(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    if (!selectedSubjectId || !selectedPeriodName || !user?.id) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updates: Partial<Grade>[] = students.map(student => {
        const existingGrade = grades[student.id]
        const gradeValue = draftGrades[student.id]
        const statusValue = draftStatuses[student.id] || 'pending'

        // If it's a completely untouched cell, don't include it in the bulk upsert
        if (!existingGrade && (gradeValue === undefined || gradeValue === '')) {
          return null
        }

        return {
          id: existingGrade?.id || crypto.randomUUID(), // Always provide an ID for bulk upsert to work
          student_id: student.id,
          subject_id: selectedSubjectId,
          period: selectedPeriodName,
          grade: gradeValue === '' ? null : (gradeValue ?? null),
          status: statusValue,
          recorded_by: user.id
        }
      }).filter(g => g !== null) as Partial<Grade>[]

      if (updates.length === 0) {
        setSaving(false)
        return
      }

      const success = await gradeService.upsertMany(updates)
      if (success) {
        setSuccess('Calificaciones guardadas exitosamente.')
        // Reload to get fresh IDs
        const newGrades = await gradeService.getBySubject(selectedSubjectId)
        const periodGrades = newGrades.filter(g => g.period === selectedPeriodName)
        const gradesMap: Record<string, Grade> = {}
        periodGrades.forEach(g => { gradesMap[g.student_id] = g })
        setGrades(gradesMap)
      } else {
        setError('Ocurrió un error al guardar las calificaciones.')
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calificaciones</h1>
        <p className="text-gray-600 mt-2">Carga y administración de notas por materia y división.</p>
      </div>

      <GradesFilters
        academicYears={academicYears}
        divisions={divisions}
        subjects={subjects}
        periods={periods}
        selectedYearId={selectedYearId}
        setSelectedYearId={setSelectedYearId}
        selectedDivId={selectedDivId}
        setSelectedDivId={setSelectedDivId}
        selectedSubjectId={selectedSubjectId}
        setSelectedSubjectId={setSelectedSubjectId}
        selectedPeriodName={selectedPeriodName}
        setSelectedPeriodName={setSelectedPeriodName}
      />

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {/* Main Content Area */}
      {selectedSubjectId && selectedPeriodName && selectedDivId ? (
        <GradesTable
          students={students}
          loading={loading}
          saving={saving}
          draftGrades={draftGrades}
          draftStatuses={draftStatuses}
          handleGradeChange={handleGradeChange}
          handleStatusChange={handleStatusChange}
          handleSave={handleSave}
        />
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500 font-medium">
            Selecciona Ciclo Lectivo, División, Materia y Período para comenzar la carga.
          </p>
        </div>
      )}
    </div>
  )
}
