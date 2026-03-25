-- RLS policies: shared read for all authenticated users, write restricted to owner

-- Incidents table RLS policies
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON incidents;
DROP POLICY IF EXISTS "Enable insert for all authenticated users" ON incidents;
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON incidents;
DROP POLICY IF EXISTS "Enable delete for all authenticated users" ON incidents;
DROP POLICY IF EXISTS "Users can view their own incidents" ON incidents;

CREATE POLICY "Authenticated users can view all incidents" ON incidents
	FOR SELECT
	USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert incidents" ON incidents
	FOR INSERT
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incidents" ON incidents
	FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incidents" ON incidents
	FOR DELETE
	USING (auth.uid() = user_id);

-- Team Leaders table RLS policies
ALTER TABLE team_leaders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON team_leaders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON team_leaders;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON team_leaders;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON team_leaders;
DROP POLICY IF EXISTS "Users can view team leaders" ON team_leaders;

CREATE POLICY "Authenticated users can view all team leaders" ON team_leaders
	FOR SELECT
	USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert team leaders" ON team_leaders
	FOR INSERT
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their team leaders" ON team_leaders
	FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their team leaders" ON team_leaders
	FOR DELETE
	USING (auth.uid() = user_id);

-- Drivers table RLS policies
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON drivers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Users can view drivers" ON drivers;

CREATE POLICY "Authenticated users can view all drivers" ON drivers
	FOR SELECT
	USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert drivers" ON drivers
	FOR INSERT
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their drivers" ON drivers
	FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their drivers" ON drivers
	FOR DELETE
	USING (auth.uid() = user_id);
