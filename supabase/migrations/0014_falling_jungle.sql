/*
  # Fix Admin User Setup and Policies

  1. Changes
    - Drop existing triggers and functions
    - Ensure role column exists with proper constraints
    - Create new policies for proper admin access
    - Set up function and trigger to maintain at least one admin
    - Update existing users to ensure at least one admin exists
*/

-- First drop existing triggers and functions
DROP TRIGGER IF EXISTS maintain_admin_trigger ON profiles;
DROP FUNCTION IF EXISTS maintain_admin();

-- Ensure role column exists and has proper constraints
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;

  -- Ensure constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'profiles' 
    AND constraint_name = 'valid_roles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT valid_roles CHECK (role IN ('admin', 'user'));
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;

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
CREATE OR REPLACE FUNCTION maintain_admin() RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  first_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    SELECT id INTO first_user_id 
    FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      UPDATE profiles SET role = 'admin' WHERE id = first_user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to maintain at least one admin
CREATE TRIGGER maintain_admin_trigger
  AFTER DELETE OR UPDATE OF role ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION maintain_admin();

-- Ensure at least one admin exists
DO $$ 
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
END $$;