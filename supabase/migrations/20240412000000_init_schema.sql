-- migration: 20240412000000_init_schema.sql
-- Description: Initialize the restaurants table with authentication policies

CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    category TEXT,
    has_delivery BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2,1) DEFAULT 0.0,
    address TEXT,
    description TEXT,
    "openTime" TEXT,
    "closeTime" TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Select policy (Public)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'restaurants' AND policyname = 'Public profiles are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone."
          ON public.restaurants FOR SELECT
          USING ( true );
    END IF;
END $$;

-- Insert policy (Authenticated Admins only)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'restaurants' AND policyname = 'Users can insert data if they are logged in.'
    ) THEN
        CREATE POLICY "Users can insert data if they are logged in."
          ON public.restaurants FOR INSERT
          WITH CHECK ( auth.uid() IS NOT NULL );
    END IF;
END $$;
