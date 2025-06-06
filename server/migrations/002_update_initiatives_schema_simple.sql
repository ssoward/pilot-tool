-- Migration to update Initiative table for new schema (SQLite compatible)
-- This migration adds columns for the new initiative data structure

-- Add new columns (will error if they already exist, but that's okay)
ALTER TABLE initiatives ADD COLUMN summary TEXT;
ALTER TABLE initiatives ADD COLUMN productGroupName TEXT;
ALTER TABLE initiatives ADD COLUMN teamName TEXT;
ALTER TABLE initiatives ADD COLUMN initiativeType TEXT CHECK (initiativeType IN ('adaptive', 'initiative'));
ALTER TABLE initiatives ADD COLUMN workingGroup TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN opportunityScore TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN hypothesis TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN contributingTeams TEXT; -- JSON array field
ALTER TABLE initiatives ADD COLUMN businessValue TEXT;
ALTER TABLE initiatives ADD COLUMN jiraProjectKey TEXT;
ALTER TABLE initiatives ADD COLUMN jiraProjectId TEXT;
ALTER TABLE initiatives ADD COLUMN mondayBoardId TEXT;
ALTER TABLE initiatives ADD COLUMN percentComplete REAL DEFAULT 0;
ALTER TABLE initiatives ADD COLUMN onTrackPercent REAL DEFAULT 0;
ALTER TABLE initiatives ADD COLUMN score REAL DEFAULT 0;
ALTER TABLE initiatives ADD COLUMN stage TEXT;
ALTER TABLE initiatives ADD COLUMN productGroupId TEXT;
ALTER TABLE initiatives ADD COLUMN teamId TEXT;

-- Update status values to use proper case
UPDATE initiatives 
SET status = CASE 
  WHEN LOWER(status) = 'draft' THEN 'Draft'
  WHEN LOWER(status) = 'proposal' THEN 'Proposal' 
  WHEN LOWER(status) = 'active' THEN 'Active'
  WHEN LOWER(status) = 'planning' THEN 'Planning'
  WHEN LOWER(status) = 'completed' THEN 'Completed'
  WHEN LOWER(status) = 'on-hold' THEN 'On Hold'
  WHEN LOWER(status) = 'cancelled' THEN 'Cancelled'
  ELSE status
END;
