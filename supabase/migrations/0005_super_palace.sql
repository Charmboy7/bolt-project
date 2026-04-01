/*
  # Add color field to areas table

  1. Changes
    - Add `color` column to `areas` table with hex color code
    - Set default color to '#E5E7EB' (gray-200)
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'areas' 
    AND column_name = 'color'
  ) THEN
    ALTER TABLE areas ADD COLUMN color text DEFAULT '#E5E7EB';
  END IF;
END $$;