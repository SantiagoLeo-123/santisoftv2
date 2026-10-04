/*
# SantiSOFT Profile System and Mentor Chats — DDL

## Overview
Creates `profiles` and `mentor_chats` tables and adds `profile_id` to `user_lesson_progress`.
Netflix-style profile selection — no auth required, all data is shared/local.

## New Tables
### profiles
- id (uuid PK), name (text), avatar (text), created_at (timestamptz)

### mentor_chats
- id (uuid PK), profile_id (uuid FK profiles CASCADE), role (text), content (text), created_at (timestamptz)

## Modified Tables
### user_lesson_progress
- Added profile_id (uuid, nullable, FK profiles ON DELETE SET NULL)

## Security
- RLS on profiles + mentor_chats with TO anon, authenticated (no sign-in screen)
- USING (true) is acceptable: data is intentionally shared (Netflix-style local profiles)
*/

-- 1. profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text NOT NULL DEFAULT '#dc2626',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles"
ON profiles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles"
ON profiles FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles"
ON profiles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles"
ON profiles FOR DELETE
TO anon, authenticated USING (true);

-- 2. mentor_chats table
CREATE TABLE IF NOT EXISTS mentor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mentor_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_mentor_chats" ON mentor_chats;
CREATE POLICY "anon_select_mentor_chats"
ON mentor_chats FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mentor_chats" ON mentor_chats;
CREATE POLICY "anon_insert_mentor_chats"
ON mentor_chats FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mentor_chats" ON mentor_chats;
CREATE POLICY "anon_update_mentor_chats"
ON mentor_chats FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_mentor_chats" ON mentor_chats;
CREATE POLICY "anon_delete_mentor_chats"
ON mentor_chats FOR DELETE
TO anon, authenticated USING (true);

-- 3. Add profile_id to user_lesson_progress (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_lesson_progress' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE user_lesson_progress
    ADD COLUMN profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_created ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_mentor_chats_profile ON mentor_chats(profile_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_profile ON user_lesson_progress(profile_id);