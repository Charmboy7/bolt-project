/*
  # Fix Profile Policies

  1. Changes
    - Drop existing policies and functions
    - Create new simplified policies without recursion
    - Add proper admin role handling
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Add special policies for admin users
*/

-- Drop existing policies and functions with CASCADE to handle dependencies
DROP POLICY IF EXISTS "read_own_profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "update_own_profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "insert_own_profile" ON profiles CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Create new simplified policies
CREATE POLICY "allow_select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    -- Users can always read their own profile
    auth.uid() = id
  );

CREATE POLICY "allow_select_all_as_admin"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    -- Admins can read all profiles
    EXISTS (
      SELECT 1 
      FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "allow_insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_all_as_admin"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    -- Admins can update all profiles
    EXISTS (
      SELECT 1 
      FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  )
  WITH CHECK (true);

-- Ensure at least one admin exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    WITH first_user AS (
      SELECT id 
      FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    )
    UPDATE profiles 
    SET role = 'admin' 
    WHERE id IN (SELECT id FROM first_user);
  END IF;
END $$;