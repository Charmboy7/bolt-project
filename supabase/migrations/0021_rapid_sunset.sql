/*
  # Fix Profile Policies

  This migration fixes the infinite recursion issue in profile policies by:
  1. Dropping all existing policies
  2. Creating new simplified policies that avoid recursion
  3. Using direct auth.uid() checks instead of subqueries
  4. Separating admin and regular user policies clearly
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_read_own" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_read_as_admin" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_insert_own" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_update_own" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_update_as_admin" ON profiles CASCADE;

-- Create new simplified policies
CREATE POLICY "read_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "read_all_profiles_as_admin"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
      AND profiles.id <> auth.uid() -- Avoid recursion by excluding self
    )
  );

CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update_other_profiles_as_admin"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
      AND profiles.id <> auth.uid() -- Avoid recursion by excluding self
    )
  )
  WITH CHECK (id <> auth.uid()); -- Admin can't update their own profile through this policy

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