-- Run this in your Supabase SQL Editor to create the demos table
CREATE TABLE IF NOT EXISTS demos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)
);

-- Enable RLS
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (demo pages need to fetch by id)
CREATE POLICY "Allow public read" ON demos FOR SELECT USING (true);
