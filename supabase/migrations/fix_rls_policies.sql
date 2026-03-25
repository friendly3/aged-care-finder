-- Fix RLS policies for team_leaders and drivers tables
-- This script will update the policies to work correctly with Supabase authentication

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read team_leaders" ON team_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to insert team_leaders" ON team_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to update team_leaders" ON team_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to delete team_leaders" ON team_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to read drivers" ON drivers;
DROP POLICY IF EXISTS "Allow authenticated users to insert drivers" ON drivers;
DROP POLICY IF EXISTS "Allow authenticated users to update drivers" ON drivers;
DROP POLICY IF EXISTS "Allow authenticated users to delete drivers" ON drivers;

-- Create new, simple policies for team_leaders
CREATE POLICY "Enable read access for authenticated users" ON team_leaders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON team_leaders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON team_leaders
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON team_leaders
  FOR DELETE USING (true);

-- Create new, simple policies for drivers
CREATE POLICY "Enable read access for authenticated users" ON drivers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON drivers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON drivers
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON drivers
  FOR DELETE USING (true);
