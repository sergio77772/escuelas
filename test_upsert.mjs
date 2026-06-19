import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUpsert() {
  // First login as the director to get a valid session
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'director@escuela.com',
    password: 'password123'
  })

  if (authError) {
    console.error("Auth error:", authError)
    return
  }

  console.log("Logged in:", authData.user.id)

  // Get user and establishment
  const { data: userData } = await supabase.from('users').select('*').eq('auth_id', authData.user.id).single()
  console.log("App User:", userData.id)

  // Get a student and subject
  const { data: students } = await supabase.from('students').select('*').eq('establishment_id', userData.establishment_id).limit(1)
  const { data: subjects } = await supabase.from('subjects').select('*').eq('establishment_id', userData.establishment_id).limit(1)

  if (!students.length || !subjects.length) {
    console.log("Missing student or subject")
    return
  }

  const studentId = students[0].id
  const subjectId = subjects[0].id

  const payload = {
    student_id: studentId,
    subject_id: subjectId,
    period: '1er Trimestre',
    grade: 8,
    status: 'approved',
    recorded_by: userData.id
  }

  console.log("Upserting payload:", payload)

  const { data, error } = await supabase.from('grades').upsert([payload])
  if (error) {
    console.error("Upsert error:", error)
  } else {
    console.log("Upsert success:", data)
  }
}

testUpsert()
