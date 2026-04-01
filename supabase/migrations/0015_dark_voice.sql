/*
  # Fix Profile Policies

  1. Changes
    - Drop existing policies that cause recursion
    - Create new simplified policies for profiles table
    - Add basic insert policy
    - Ensure proper admin access without recursion

  2. Security
    - Maintain row level security
    - Ensure users can only access their own data
    - Allow admins to access all profiles
*/

-- First drop all existing policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;

-- Create new simplified policies
CREATE POLICY "allow_select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "allow_admin_select_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "allow_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "allow_admin_update_all"
  ON profiles FOR UPDATE
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "allow_insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure first user is admin if no admin exists
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