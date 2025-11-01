/*
  # Create tutores and temp_tutores tables

  1. New Tables
    - `temp_tutores`
      - `id` (uuid, primary key) 
      - `session_id` (text, unique) - for tracking questionnaire sessions
      - `question_1_answer` (text) - stores answer to first question
      - `created_at` (timestamp)
      
    - `tutores` 
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - links to authenticated user
      - `name` (text) - tutor's display name
      - `email` (text) - tutor's contact email
      - `question_1_answer` (text) - stores answer from questionnaire
      - `bio` (text) - tutor's biography/description
      - `subjects` (text array) - list of subjects they teach
      - `profile_picture` (text) - URL to profile image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - `temp_tutores`: Public read/write (temporary data, no auth required)
    - `tutores`: Authenticated users can read all, but only update their own records
*/

-- Create temp_tutores table for questionnaire data
CREATE TABLE IF NOT EXISTS temp_tutores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  question_1_answer text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create tutores table for permanent tutor profiles  
CREATE TABLE IF NOT EXISTS tutores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  question_1_answer text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  subjects text[] DEFAULT '{}',
  profile_picture text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE temp_tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for temp_tutores (public access for questionnaire)
CREATE POLICY "Anyone can insert temp tutor data"
  ON temp_tutores
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update temp tutor data"
  ON temp_tutores
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read temp tutor data"
  ON temp_tutores
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for tutores (authenticated access)
CREATE POLICY "Anyone can read tutor profiles"
  ON tutores
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert their own tutor profile"
  ON tutores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tutor profile"
  ON tutores  
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for tutores
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_tutores_updated_at'
  ) THEN
    CREATE TRIGGER update_tutores_updated_at
      BEFORE UPDATE ON tutores
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;