/*
  # Fix Admin User Authentication and Policies

  1. Changes
    - Drop existing triggers and functions
    - Ensure role column exists with proper constraints
    - Create new policies for admin access
    - Create trigger to maintain at least one admin
*/

-- First drop existing triggers and functions
DROP TRIGGER IF EXISTS ensure_admin_trigger ON profiles;
DROP FUNCTION IF EXISTS ensure_admin_exists();

-- Ensure role column exists and has proper constraints
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
    ALTER TABLE profiles ADD CONSTRAINT valid_roles CHECK (role IN ('admin', 'user'));
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "admin_read_all" ON profiles;
DROP POLICY IF EXISTS "admin_update_all" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create new policies with proper admin access
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to maintain at least one admin
CREATE OR REPLACE FUNCTION maintain_admin() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    UPDATE profiles 
    SET role = 'admin' 
    WHERE id = (
      SELECT id 
      FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure at least one admin exists
CREATE TRIGGER maintain_admin_trigger
  AFTER DELETE OR UPDATE OF role ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION maintain_admin();