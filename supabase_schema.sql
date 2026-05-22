-- ============================================================
-- GESTIÓN ESCOLAR - SCHEMA SUPABASE
-- ============================================================

-- 1. ESTABLECIMIENTOS
CREATE TABLE establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  ruc VARCHAR(20),
  plan VARCHAR(50) DEFAULT 'modelo_a', -- 'modelo_a' o 'modelo_b'
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. USUARIOS (con roles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- director, secretario, docente, preceptor, padre, alumno, tecnico
  auth_id UUID UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(establishment_id, email)
);

-- 3. ALUMNOS (Legajo Digital)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  dni VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  photo_url TEXT,
  blood_type VARCHAR(10),
  medical_info TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, graduated, withdrawn, pending
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. TUTORES/PADRES/GUARDIAS
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  dni VARCHAR(20),
  relationship VARCHAR(50) NOT NULL, -- padre, madre, tutor, otro
  email VARCHAR(255),
  phone VARCHAR(20),
  primary_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. AÑOS ESCOLARES
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, closed
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(establishment_id, year)
);

-- 6. DIVISIONES (1° A, 2° B, etc)
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- '1° A', '2° B'
  teacher_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. INSCRIPCIONES (Alumno en División)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active', -- active, withdrawn
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, division_id)
);

-- 8. MATERIAS
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. ASIGNACIÓN DE DOCENTES A MATERIAS/DIVISIONES
CREATE TABLE subject_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subject_id, teacher_id, division_id)
);

-- 10. NOTAS
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  period VARCHAR(100), -- '1er trimestre', '2do trimestre', etc
  grade DECIMAL(4,2), -- 1-10
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, in_progress, failed
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. ASISTENCIAS
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL, -- present, absent, justified, late
  notes TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id, attendance_date)
);

-- 12. JUSTIFICACIONES DE AUSENCIAS
CREATE TABLE absence_justifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES attendances(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  authorized_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. NOTIFICACIONES A FAMILIAS (Modelo A)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  type VARCHAR(50) NOT NULL, -- grade_posted, absence, bulletin, announcement
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 14. COMUNICADOS INSTITUCIONALES (Modelo A)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(50), -- 'all', 'parents', 'teachers', 'students'
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 15. PERÍODOS DE CALIFICACIÓN
CREATE TABLE grading_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- '1er Trimestre', '1er Semestre', etc
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'open', -- open, closed
  created_at TIMESTAMP DEFAULT NOW()
);

-- 16. BITÁCORA DE ACCESOS (Seguridad)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL, -- 'login', 'create_student', 'edit_grades', etc
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================

CREATE INDEX idx_users_establishment ON users(establishment_id);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_students_establishment ON students(establishment_id);
CREATE INDEX idx_students_dni ON students(dni);
CREATE INDEX idx_guardians_student ON guardians(student_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_division ON enrollments(division_id);
CREATE INDEX idx_divisions_academic_year ON divisions(academic_year_id);
CREATE INDEX idx_subjects_establishment ON subjects(establishment_id);
CREATE INDEX idx_subject_assignments_teacher ON subject_assignments(teacher_id);
CREATE INDEX idx_subject_assignments_division ON subject_assignments(division_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_attendances_student ON attendances(student_id);
CREATE INDEX idx_attendances_date ON attendances(attendance_date);
CREATE INDEX idx_notifications_establishment ON notifications(establishment_id);
CREATE INDEX idx_notifications_email ON notifications(recipient_email);
CREATE INDEX idx_audit_logs_establishment ON audit_logs(establishment_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- ============================================================
-- RLS (ROW LEVEL SECURITY) - Políticas de Seguridad
-- ============================================================

ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política básica: Los usuarios solo ven datos de su establecimiento
CREATE POLICY "establishments_self_access" ON establishments
  FOR SELECT USING (
    auth.uid() IN (SELECT auth_id FROM users WHERE establishment_id = establishments.id)
  );

CREATE POLICY "users_establishment_access" ON users
  FOR SELECT USING (
    establishment_id IN (SELECT establishment_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "students_establishment_access" ON students
  FOR SELECT USING (
    establishment_id IN (SELECT establishment_id FROM users WHERE auth_id = auth.uid())
  );

-- Padres solo ven a sus hijos
CREATE POLICY "guardians_see_own_children" ON students
  FOR SELECT USING (
    id IN (
      SELECT student_id FROM guardians 
      WHERE establishment_id IN (
        SELECT establishment_id FROM users WHERE auth_id = auth.uid()
      )
    )
    OR establishment_id IN (
      SELECT establishment_id FROM users WHERE auth_id = auth.uid() AND role != 'padre'
    )
  );

CREATE POLICY "grades_establishment_access" ON grades
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students 
      WHERE establishment_id IN (
        SELECT establishment_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

CREATE POLICY "attendances_establishment_access" ON attendances
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students 
      WHERE establishment_id IN (
        SELECT establishment_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================================
-- FUNCIONES Y TRIGGERS ÚTILES
-- ============================================================

-- Función para registrar cambios en la bitácora
CREATE OR REPLACE FUNCTION log_audit_action(
  p_establishment_id UUID,
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_details JSONB
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_log_id UUID;
BEGIN
  -- Obtener el user_id del usuario actual
  SELECT id INTO v_user_id FROM users 
  WHERE auth_id = auth.uid() LIMIT 1;

  INSERT INTO audit_logs (
    establishment_id, user_id, action, entity_type, entity_id, details, created_at
  ) VALUES (
    p_establishment_id, v_user_id, p_action, p_entity_type, p_entity_id, p_details, NOW()
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_establishments_updated_at
  BEFORE UPDATE ON establishments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
