/*
  # Areas and Settings Schema

  1. New Tables
    - `areas`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `areas` table
    - Add policies for authenticated users to manage their areas
*/

CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- Policies for areas
CREATE POLICY "Users can view their own areas"
  ON areas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own areas"
  ON areas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own areas"
  ON areas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own areas"
  ON areas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);