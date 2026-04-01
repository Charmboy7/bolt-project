-- Drop all existing policies
DROP POLICY IF EXISTS "allow_select_own_profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_select_all_as_admin" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "allow_update_all_as_admin" ON profiles CASCADE;

-- Create new simplified policies that avoid recursion
CREATE POLICY "allow_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "allow_read_as_admin"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM auth.users u 
      INNER JOIN profiles p ON u.id = p.id 
      WHERE u.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "allow_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_as_admin"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM auth.users u 
      INNER JOIN profiles p ON u.id = p.id 
      WHERE u.id = auth.uid() 
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