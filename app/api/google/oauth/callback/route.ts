-- Add timezone column to google_accounts table
ALTER TABLE app.google_accounts 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'app' 
  AND table_name = 'google_accounts'
ORDER BY ordinal_position;
