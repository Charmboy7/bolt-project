/*
  # Fix admin user login and profile

  1. Changes
    - Drop existing policies that may cause recursion
    - Create new simplified policies for profiles
    - Ensure admin user exists with proper credentials
    - Create admin profile if missing

  2. Security
    - Enable RLS
    - Add policies for profile access
*/

-- First drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "allow_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_select_all" ON profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_update_all" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure admin user exists
DO $$ 
DECLARE 
  admin_id uuid;
BEGIN
  -- Get or create admin user
  SELECT id INTO admin_id 
  FROM auth.users 
  WHERE email = 'admin@example.com';

  IF admin_id IS NULL THEN
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token
    ) VALUES (
      'admin@example.com',
      crypt('admin@task', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      now(),
      now(),
      'authenticated',
      ''
    )
    RETURNING id INTO admin_id;
  END IF;

  -- Ensure admin profile exists
  INSERT INTO profiles (id, name, role, created_at)
  VALUES (
    admin_id,
    'Admin User',
    'admin',
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin'
  WHERE profiles.id = admin_id;
END $$;