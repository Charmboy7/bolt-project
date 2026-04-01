/*
  # Fix Admin User and Profiles

  1. Changes
    - Ensure admin user exists
    - Add admin role to first user if no admin exists
    - Add missing profile columns
*/

-- First ensure the role column exists and has proper constraints
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user',
  ADD CONSTRAINT valid_roles CHECK (role IN ('admin', 'user'));

-- Create function to ensure at least one admin exists
CREATE OR REPLACE FUNCTION ensure_admin_exists() RETURNS void AS $$
BEGIN
  -- If no admin exists, make the first user an admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    UPDATE profiles 
    SET role = 'admin' 
    WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Run the function
SELECT ensure_admin_exists();

-- Create trigger to ensure admin exists after profile changes
CREATE OR REPLACE FUNCTION check_admin_exists() RETURNS trigger AS $$
BEGIN
  PERFORM ensure_admin_exists();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_admin_trigger
  AFTER DELETE OR UPDATE OF role ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION check_admin_exists();