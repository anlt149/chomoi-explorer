-- Migration: Ensure restaurant names are unique for synchronization
-- This allows the crawler to 'upsert' based on the name without creating duplicates.

ALTER TABLE public.restaurants 
ADD CONSTRAINT restaurants_name_unique UNIQUE (name);
