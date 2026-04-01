/*
  # Final fix for profiles policies
  
  1. Changes
    - Simplify policies to avoid recursion
    - Use materialized role check
    - Maintain proper access control
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create a function to check admin status
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
CREATE POLICY "select_own_or_admin" ON profiles
  FOR SELECT TO authenticated
  USING (
    CASE 
      WHEN is_admin() THEN true
      ELSE id = auth.uid()
    END
  );

CREATE POLICY "insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "update_own_or_admin" ON profiles
  FOR UPDATE TO authenticated
  USING (
    CASE 
      WHEN is_admin() THEN true
      ELSE id = auth.uid()
    END
  );