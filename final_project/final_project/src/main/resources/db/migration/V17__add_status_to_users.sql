-- Add status column to users table if it doesn't exist
DO $$
BEGIN
    -- Create the enum type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');
    END IF;

    -- Add the status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'status'
    ) THEN
        ALTER TABLE users ADD COLUMN status user_status NOT NULL DEFAULT 'ACTIVE';
    END IF;
END $$;

-- Fix the default value to use uppercase (matching Java enum)
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'ACTIVE';

-- Update any existing lowercase values
UPDATE users SET status = 'ACTIVE' WHERE status::text = 'active';
UPDATE users SET status = 'INACTIVE' WHERE status::text = 'inactive';
