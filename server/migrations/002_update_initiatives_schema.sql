-- Migration to update Initiative table for new schema
-- This migration adds columns for the new initiative data structure

ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS productGroupName TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS teamName TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS initiativeType TEXT CHECK (initiativeType IN ('adaptive', 'initiative'));
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS workingGroup TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS opportunityScore TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS hypothesis TEXT; -- JSON field
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS contributingTeams TEXT; -- JSON array field

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

-- Update priority values to use proper case
UPDATE initiatives 
SET priority = CASE 
  WHEN LOWER(priority) = 'high' THEN 'High'
  WHEN LOWER(priority) = 'medium' THEN 'Medium'
  WHEN LOWER(priority) = 'low' THEN 'Low'
  ELSE priority
END;

-- Migrate existing data to new structure where possible
UPDATE initiatives 
SET 
  summary = COALESCE(name, 'Untitled Initiative'),
  productGroupName = COALESCE(owner, 'Unknown'),
  teamName = COALESCE(owner, 'Unknown'),
  initiativeType = 'initiative',
  workingGroup = '{"name": "", "lead": "", "members": []}',
  opportunityScore = '{"totalScore": 0, "confidence": "Low", "breakdown": {}}',
  hypothesis = '{"statement": "", "assumptions": [], "risks": [], "successMetrics": []}'
WHERE summary IS NULL OR summary = '';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_initiatives_summary ON initiatives(summary);
CREATE INDEX IF NOT EXISTS idx_initiatives_product_group ON initiatives(productGroupName);
CREATE INDEX IF NOT EXISTS idx_initiatives_team ON initiatives(teamName);
CREATE INDEX IF NOT EXISTS idx_initiatives_type ON initiatives(initiativeType);
