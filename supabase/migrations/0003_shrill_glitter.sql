/*
  # Add tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `number` (auto-incrementing number)
      - `name` (text)
      - `due_date` (timestamptz, nullable)
      - `area` (text, nullable)
      - `priority` (text, enum: A1, A2, B1, B2)
      - `is_completed` (boolean)
      - `is_archived` (boolean)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
*/

-- Create tasks table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tasks'
  ) THEN
    CREATE TABLE tasks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      number bigint GENERATED ALWAYS AS IDENTITY,
      name text NOT NULL,
      due_date timestamptz,
      area text,
      priority text CHECK (priority IN ('A1', 'A2', 'B1', 'B2')),
      is_completed boolean DEFAULT false,
      is_archived boolean DEFAULT false,
      user_id uuid REFERENCES auth.users(id) NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;