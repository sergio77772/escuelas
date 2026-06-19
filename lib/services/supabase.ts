import { createClient } from '@/lib/supabase/client'
import { 
  Student, 
  Guardian, 
  Grade, 
  Attendance,
  Subject,
  Division,
  AcademicYear,
  AppUser,
  Establishment,
  GradingPeriod
} from '@/lib/types'

const supabase = createClient()

// ============================================================================
// ESTABLECIMIENTOS
// ============================================================================

export const establishmentService = {
  async getById(id: string): Promise<Establishment | null> {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching establishment:', error)
      return null
    }
    return data
  },

  async getAll(): Promise<Establishment[]> {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
    
    if (error) {
      console.error('Error fetching establishments:', error)
      return []
    }
    return data || []
  },

  async create(establishment: Partial<Establishment>): Promise<Establishment | null> {
    const { data, error } = await supabase
      .from('establishments')
      .insert([establishment])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating establishment:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<Establishment>): Promise<Establishment | null> {
    const { data, error } = await supabase
      .from('establishments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating establishment:', error)
      return null
    }
    return data
  },
}

// ============================================================================
// USUARIOS
// ============================================================================

export const userService = {
  async getById(id: string): Promise<AppUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  },

  async getByEmail(email: string, establishmentId: string): Promise<AppUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('establishment_id', establishmentId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by email:', error)
    }
    return data || null
  },

  async getByAuthId(authId: string): Promise<AppUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by auth_id:', error)
    }
    return data || null
  },

  async getByEstablishment(establishmentId: string): Promise<AppUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('establishment_id', establishmentId)
    
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    return data || []
  },

  async create(user: Partial<AppUser>): Promise<AppUser | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<AppUser>): Promise<AppUser | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    return data
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting user:', error)
      return false
    }
    return true
  },
}

// ============================================================================
// ALUMNOS
// ============================================================================

export const studentService = {
  async getById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching student:', error)
      return null
    }
    return data
  },

  async getByEstablishment(establishmentId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('last_name', { ascending: true })
    
    if (error) {
      console.error('Error fetching students:', error)
      return []
    }
    return data || []
  },

  async getByDivision(divisionId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        enrollments(division_id)
      `)
      .eq('enrollments.division_id', divisionId)
      .order('last_name', { ascending: true })
    
    if (error) {
      console.error('Error fetching students by division:', error)
      return []
    }
    return data || []
  },

  async create(student: Partial<Student>): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating student:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating student:', error)
      return null
    }
    return data
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting student:', error)
      return false
    }
    return true
  },
}

// ============================================================================
// TUTORES
// ============================================================================

export const guardianService = {
  async getByStudent(studentId: string): Promise<Guardian[]> {
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId)
    
    if (error) {
      console.error('Error fetching guardians:', error)
      return []
    }
    return data || []
  },

  async create(guardian: Partial<Guardian>): Promise<Guardian | null> {
    const { data, error } = await supabase
      .from('guardians')
      .insert([guardian])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating guardian:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<Guardian>): Promise<Guardian | null> {
    const { data, error } = await supabase
      .from('guardians')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating guardian:', error)
      return null
    }
    return data
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('guardians')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting guardian:', error)
      return false
    }
    return true
  },
}

// ============================================================================
// NOTAS
// ============================================================================

export const gradeService = {
  async getByStudent(studentId: string): Promise<Grade[]> {
    const { data, error } = await supabase
      .from('grades')
      .select('*, subjects(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching grades:', error)
      return []
    }
    return data || []
  },

  async getBySubject(subjectId: string): Promise<Grade[]> {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('subject_id', subjectId)
    
    if (error) {
      console.error('Error fetching grades by subject:', error)
      return []
    }
    return data || []
  },

  async create(grade: Partial<Grade>): Promise<Grade | null> {
    const { data, error } = await supabase
      .from('grades')
      .insert([grade])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating grade:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<Grade>): Promise<Grade | null> {
    const { data, error } = await supabase
      .from('grades')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating grade:', error)
      return null
    }
    return data
  },

  async upsertMany(grades: Partial<Grade>[]): Promise<boolean> {
    const { error } = await supabase
      .from('grades')
      .upsert(grades)
    
    if (error) {
      console.error('Error upserting grades:', error)
      return false
    }
    return true
  },
}

// ============================================================================
// ASISTENCIAS
// ============================================================================

export const attendanceService = {
  async getByStudent(studentId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*, subjects(*)')
      .eq('student_id', studentId)
      .order('attendance_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching attendances:', error)
      return []
    }
    return data || []
  },

  async getByDivisionAndDate(divisionId: string, date: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*, students(*)')
      .eq('attendance_date', date)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching attendances:', error)
      return []
    }
    return data || []
  },

  async getBySubjectAndDate(subjectId: string, date: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('attendance_date', date)
    
    if (error) {
      console.error('Error fetching attendances by subject and date:', error)
      return []
    }
    return data || []
  },

  async create(attendance: Partial<Attendance>): Promise<Attendance | null> {
    const { data, error } = await supabase
      .from('attendances')
      .insert([attendance])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating attendance:', error)
      return null
    }
    return data
  },

  async update(id: string, updates: Partial<Attendance>): Promise<Attendance | null> {
    const { data, error } = await supabase
      .from('attendances')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating attendance:', error)
      return null
    }
    return data
  },

  async upsertMany(attendances: Partial<Attendance>[]): Promise<boolean> {
    const { error } = await supabase
      .from('attendances')
      .upsert(attendances)
    
    if (error) {
      console.error('Error upserting attendances:', error)
      return false
    }
    return true
  },
}

// ============================================================================
// AÑOS ACADÉMICOS Y DIVISIONES
// ============================================================================

export const academicYearService = {
  async getByEstablishment(establishmentId: string): Promise<AcademicYear[]> {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('year', { ascending: false })
    
    if (error) {
      console.error('Error fetching academic years:', error)
      return []
    }
    return data || []
  },

  async create(year: Partial<AcademicYear>): Promise<AcademicYear | null> {
    const { data, error } = await supabase
      .from('academic_years')
      .insert([year])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating academic year:', error)
      return null
    }
    return data
  },
}

export const divisionService = {
  async getByAcademicYear(academicYearId: string): Promise<Division[]> {
    const { data, error } = await supabase
      .from('divisions')
      .select('*')
      .eq('academic_year_id', academicYearId)
    
    if (error) {
      console.error('Error fetching divisions:', error)
      return []
    }
    return data || []
  },

  async create(division: Partial<Division>): Promise<Division | null> {
    const { data, error } = await supabase
      .from('divisions')
      .insert([division])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating division:', error)
      return null
    }
    return data
  },
}

// ============================================================================
// MATERIAS
// ============================================================================

export const subjectService = {
  async getByAcademicYear(academicYearId: string): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('academic_year_id', academicYearId)
    
    if (error) {
      console.error('Error fetching subjects:', error)
      return []
    }
    return data || []
  },

  async create(subject: Partial<Subject>): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating subject:', error)
      return null
    }
    return data
  },
}

// ============================================================================
// PERÍODOS DE CALIFICACIÓN
// ============================================================================

export const gradingPeriodService = {
  async getByAcademicYear(academicYearId: string): Promise<GradingPeriod[]> {
    const { data, error } = await supabase
      .from('grading_periods')
      .select('*')
      .eq('academic_year_id', academicYearId)
    
    if (error) {
      console.error('Error fetching grading periods:', error)
      return []
    }
    return data || []
  }
}

