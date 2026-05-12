-- Seed default administrator user
-- Run this migration after all previous migrations have applied
-- Login credentials: username = admin, password = admin123

DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get the ADMINISTRATOR role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMINISTRATOR';

    -- Skip if ADMINISTRATOR role doesn't exist (should never happen, but safety first)
    IF admin_role_id IS NULL THEN
        RAISE NOTICE 'ADMINISTRATOR role not found. Skipping admin user seed.';
        RETURN;
    END IF;

    -- Check if admin user already exists
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';

    IF admin_user_id IS NULL THEN
        -- Create admin user
        -- Password: admin123 (bcrypt hashed with strength 10)
        INSERT INTO users (
            id,
            username,
            email,
            password_hash,
            status,
            created_at,
            updated_at,
            created_by
        ) VALUES (
            gen_random_uuid(),
            'admin',
            'admin@maedcoop.com',
            '$2b$10$Fg3K7h0SNov1xRprDpRIDOtT4SjlW6yhi8hgPqlSxQNlEetuBb6My',
            'ACTIVE',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            'SYSTEM'
        )
        RETURNING id INTO admin_user_id;

        -- Assign ADMINISTRATOR role to the new user
        INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by)
        VALUES (admin_user_id, admin_role_id, CURRENT_TIMESTAMP, 'SYSTEM');

        RAISE NOTICE 'Default admin user created successfully. Login: admin / admin123';
    ELSE
        RAISE NOTICE 'Admin user already exists. Skipping seed.';
    END IF;
END $$;
