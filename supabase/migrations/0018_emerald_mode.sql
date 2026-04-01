/*
  # Fix profile policies and admin user creation

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new simplified policies for profiles
    - Add function to check admin role
    - Ensure proper admin access control

  2. Security
    - Enable RLS
    - Add policies for profile access
    - Maintain admin privileges
*/

-- Drop existing policies
DROP POLICY IF EXISTS "allow_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_read_all" ON profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_update_all" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new simplified policies
CREATE POLICY "read_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (auth.uid() = id OR is_admin());

CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure at least one admin exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    UPDATE profiles 
    SET role = 'admin' 
    WHERE id IN (
      SELECT id 
      FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END $$;