-- Add user_id column to incidents, team_leaders, and drivers tables for user isolation

-- Add user_id to incidents table
ALTER TABLE incidents ADD COLUMN user_id UUID;
CREATE INDEX idx_incidents_user_id ON incidents(user_id);

-- Add user_id to team_leaders table  
ALTER TABLE team_leaders ADD COLUMN user_id UUID;
CREATE INDEX idx_team_leaders_user_id ON team_leaders(user_id);

-- Add user_id to drivers table
ALTER TABLE drivers ADD COLUMN user_id UUID;
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
