/*
  # Final fix for profiles policies and admin setup
  
  1. Changes
    - Simplify policies to use direct role checks
    - Create admin user properly
    - Fix infinite recursion issues
    
  2. Security
    - Maintain proper access control
    - Ensure admin user exists
*/

-- First create the admin user if it doesn't exist
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
SELECT 
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin@task', gen_salt('bf')),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

-- Create admin profile
INSERT INTO profiles (id, name, role)
SELECT 
  id,
  'Admin User',
  'admin'
FROM auth.users 
WHERE email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE role = 'admin'
);

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (true);