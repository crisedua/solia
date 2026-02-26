-- Add website_url column to demos table
-- Run this in your Supabase SQL Editor if the demos table already exists
ALTER TABLE demos ADD COLUMN IF NOT EXISTS website_url TEXT;
