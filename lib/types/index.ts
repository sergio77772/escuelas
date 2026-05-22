// Establecimientos
export interface Establishment {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  ruc: string | null
  plan: 'modelo_a' | 'modelo_b'
  subscription_status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

// Usuarios
export interface AppUser {
  id: string
  establishment_id: string
  email: string
  full_name: string
  role: 'director' | 'secretario' | 'docente' | 'preceptor' | 'padre' | 'alumno' | 'tecnico'
  auth_id: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Alumnos
export interface Student {
  id: string
  establishment_id: string
  first_name: string
  last_name: string
  dni: string | null
  date_of_birth: string | null
  address: string | null
  phone: string | null
  email: string | null
  photo_url: string | null
  blood_type: string | null
  medical_info: string | null
  status: 'active' | 'graduated' | 'withdrawn' | 'pending'
  created_at: string
  updated_at: string
}

// Tutores
export interface Guardian {
  id: string
  establishment_id: string
  student_id: string
  full_name: string
  dni: string | null
  relationship: 'padre' | 'madre' | 'tutor' | 'otro'
  email: string | null
  phone: string | null
  primary_contact: boolean
  created_at: string
  updated_at: string
}

// Años Académicos
export interface AcademicYear {
  id: string
  establishment_id: string
  year: number
  start_date: string | null
  end_date: string | null
  status: 'active' | 'closed'
  created_at: string
}

// Divisiones
export interface Division {
  id: string
  academic_year_id: string
  name: string
  teacher_id: string | null
  created_at: string
}

// Inscripciones
export interface Enrollment {
  id: string
  student_id: string
  division_id: string
  status: 'active' | 'withdrawn'
  created_at: string
}

// Materias
export interface Subject {
  id: string
  establishment_id: string
  academic_year_id: string
  name: string
  code: string | null
  created_at: string
}

// Asignación de Docentes
export interface SubjectAssignment {
  id: string
  subject_id: string
  teacher_id: string
  division_id: string
  created_at: string
}

// Notas
export interface Grade {
  id: string
  student_id: string
  subject_id: string
  period: string
  grade: number
  status: 'pending' | 'approved' | 'in_progress' | 'failed'
  recorded_by: string | null
  created_at: string
  updated_at: string
}

// Asistencias
export interface Attendance {
  id: string
  student_id: string
  subject_id: string
  attendance_date: string
  status: 'present' | 'absent' | 'justified' | 'late'
  notes: string | null
  recorded_by: string | null
  created_at: string
}

// Justificaciones
export interface AbsenceJustification {
  id: string
  attendance_id: string
  reason: string
  authorized_by: string | null
  created_at: string
}

// Notificaciones
export interface Notification {
  id: string
  establishment_id: string
  guardian_id: string | null
  student_id: string | null
  recipient_email: string
  subject: string
  message: string
  type: 'grade_posted' | 'absence' | 'bulletin' | 'announcement'
  sent_at: string | null
  read_at: string | null
  created_at: string
}

// Comunicados
export interface Announcement {
  id: string
  establishment_id: string
  author_id: string
  title: string
  content: string
  target_audience: 'all' | 'parents' | 'teachers' | 'students'
  published_at: string
  created_at: string
}

// Períodos de Calificación
export interface GradingPeriod {
  id: string
  academic_year_id: string
  name: string
  start_date: string | null
  end_date: string | null
  status: 'open' | 'closed'
  created_at: string
}

// Bitácora de Accesos
export interface AuditLog {
  id: string
  establishment_id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}
