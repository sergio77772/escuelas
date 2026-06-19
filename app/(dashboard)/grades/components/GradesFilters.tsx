import React from 'react'
import { AcademicYear, Division, Subject, GradingPeriod } from '@/lib/types'

interface GradesFiltersProps {
  academicYears: AcademicYear[]
  divisions: Division[]
  subjects: Subject[]
  periods: GradingPeriod[]
  
  selectedYearId: string
  setSelectedYearId: (id: string) => void
  
  selectedDivId: string
  setSelectedDivId: (id: string) => void
  
  selectedSubjectId: string
  setSelectedSubjectId: (id: string) => void
  
  selectedPeriodName: string
  setSelectedPeriodName: (name: string) => void
}

export function GradesFilters({
  academicYears, divisions, subjects, periods,
  selectedYearId, setSelectedYearId,
  selectedDivId, setSelectedDivId,
  selectedSubjectId, setSelectedSubjectId,
  selectedPeriodName, setSelectedPeriodName
}: GradesFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo Lectivo</label>
        <select 
          value={selectedYearId} 
          onChange={e => setSelectedYearId(e.target.value)}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccione...</option>
          {academicYears.map(y => <option key={y.id} value={y.id}>{y.year}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">División</label>
        <select 
          value={selectedDivId} 
          onChange={e => setSelectedDivId(e.target.value)}
          disabled={!selectedYearId}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Seleccione...</option>
          {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
        <select 
          value={selectedSubjectId} 
          onChange={e => setSelectedSubjectId(e.target.value)}
          disabled={!selectedDivId}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Seleccione...</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
        <select 
          value={selectedPeriodName} 
          onChange={e => setSelectedPeriodName(e.target.value)}
          disabled={!selectedYearId}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Seleccione...</option>
          {periods.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>
    </div>
  )
}
