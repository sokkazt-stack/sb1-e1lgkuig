import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type TempTutorData = {
  id?: string
  session_id: string
  question_1_answer: string
  created_at?: string
}

export type TutorData = {
  id?: string
  user_id: string
  name: string
  email: string
  question_1_answer: string
  bio?: string
  subjects?: string[]
  profile_picture?: string
  created_at?: string
  updated_at?: string
}