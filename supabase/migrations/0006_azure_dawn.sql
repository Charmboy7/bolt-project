/*
  # Fix Areas RLS Policies

  1. Changes
    - Drop existing RLS policies for areas table
    - Create new, corrected RLS policies that properly handle user_id
    - Ensure policies use auth.uid() consistently
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own areas" ON areas;
DROP POLICY IF EXISTS "Users can create their own areas" ON areas;
DROP POLICY IF EXISTS "Users can update their own areas" ON areas;
DROP POLICY IF EXISTS "Users can delete their own areas" ON areas;

-- Create new policies with correct user_id handling
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