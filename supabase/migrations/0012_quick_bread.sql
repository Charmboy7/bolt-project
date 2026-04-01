/*
  # Fix Admin User Authentication and Permissions

  1. Changes
    - Drop existing function and trigger
    - Recreate function and trigger with proper handling
    - Update policies for admin access
*/

-- First drop existing function and trigger
DROP TRIGGER IF EXISTS ensure_admin_trigger ON profiles;
DROP FUNCTION IF EXISTS ensure_admin_exists();

-- Create new function with proper return type
CREATE OR REPLACE FUNCTION ensure_admin_exists() RETURNS trigger AS $$
DECLARE
  first_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    SELECT id INTO first_user_id FROM profiles ORDER BY created_at ASC LIMIT 1;
    IF first_user_id IS NOT NULL THEN
      UPDATE profiles SET role = 'admin' WHERE id = first_user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER ensure_admin_trigger
  AFTER DELETE OR UPDATE OF role ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION ensure_admin_exists();

-- Drop existing policies
DROP POLICY IF EXISTS "admin_read_all" ON profiles;
DROP POLICY IF EXISTS "admin_update_all" ON profiles;

-- Create new admin policies
CREATE POLICY "admin_read_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR id = auth.uid()
  );

CREATE POLICY "admin_update_all"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR id = auth.uid()
  );