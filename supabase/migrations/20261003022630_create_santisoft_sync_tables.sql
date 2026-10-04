/*
# SantiSOFT Cloud Sync Tables

## Overview
Creates 4 tables to enable multi-device cloud synchronization for the SantiSOFT study app.
Each table is scoped to the authenticated user (user_id defaults to auth.uid()) and protected
by Row Level Security so users can only access their own data.

## New Tables

### 1. user_lesson_progress
Tracks which lessons the user has marked as watched.
- `id` (uuid PK)
- `user_id` (uuid, FK auth.users, NOT NULL DEFAULT auth.uid())
- `lesson_id` (text) — the lesson identifier from curriculum.ts
- `specialty` (text) — e.g. "Cirurgia Geral", "Pediatria"
- `completed` (boolean, default true)
- `updated_at` (timestamptz, auto-updated)
- Unique constraint on (user_id, lesson_id)

### 2. user_question_history
Records every answered question with correctness, selected option, and timestamps.
- `id` (uuid PK)
- `user_id` (uuid, FK auth.users, NOT NULL DEFAULT auth.uid())
- `question_id` (text) — the question identifier
- `specialty` (text)
- `topic` (text)
- `selected_option` (text) — A/B/C/D/E
- `correct_option` (text) — A/B/C/D/E
- `is_correct` (boolean)
- `answered_at` (timestamptz, default now())

### 3. user_schedule_tasks
Stores daily schedule task completion status.
- `id` (uuid PK)
- `user_id` (uuid, FK auth.users, NOT NULL DEFAULT auth.uid())
- `task_id` (text) — identifier of the schedule task
- `task_date` (date) — which day the task belongs to
- `completed` (boolean, default false)
- `updated_at` (timestamptz, auto-updated)
- Unique constraint on (user_id, task_id, task_date)

### 4. user_mentor_messages
Stores mentor conversation history and spaced-repetition review data.
- `id` (uuid PK)
- `user_id` (uuid, FK auth.users, NOT NULL DEFAULT auth.uid())
- `role` (text) — 'user' or 'assistant'
- `content` (text)
- `metadata` (jsonb) — flexible storage for revision cycles, tema info, etc.
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on all 4 tables.
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE) scoped to authenticated users owning their rows.
- Owner column `user_id` has `DEFAULT auth.uid()` so client inserts that omit user_id succeed.
*/

-- 1. user_lesson_progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  specialty text NOT NULL DEFAULT 'Geral',
  completed boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "select_own_lesson_progress"
ON user_lesson_progress FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "insert_own_lesson_progress"
ON user_lesson_progress FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "update_own_lesson_progress"
ON user_lesson_progress FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "delete_own_lesson_progress"
ON user_lesson_progress FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- 2. user_question_history
CREATE TABLE IF NOT EXISTS user_question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  specialty text NOT NULL DEFAULT 'Geral',
  topic text NOT NULL DEFAULT '',
  selected_option text NOT NULL DEFAULT '',
  correct_option text NOT NULL DEFAULT '',
  is_correct boolean NOT NULL DEFAULT false,
  answered_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_question_history" ON user_question_history;
CREATE POLICY "select_own_question_history"
ON user_question_history FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_question_history" ON user_question_history;
CREATE POLICY "insert_own_question_history"
ON user_question_history FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_question_history" ON user_question_history;
CREATE POLICY "update_own_question_history"
ON user_question_history FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_question_history" ON user_question_history;
CREATE POLICY "delete_own_question_history"
ON user_question_history FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- 3. user_schedule_tasks
CREATE TABLE IF NOT EXISTS user_schedule_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id, task_date)
);

ALTER TABLE user_schedule_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_schedule_tasks" ON user_schedule_tasks;
CREATE POLICY "select_own_schedule_tasks"
ON user_schedule_tasks FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_schedule_tasks" ON user_schedule_tasks;
CREATE POLICY "insert_own_schedule_tasks"
ON user_schedule_tasks FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_schedule_tasks" ON user_schedule_tasks;
CREATE POLICY "update_own_schedule_tasks"
ON user_schedule_tasks FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_schedule_tasks" ON user_schedule_tasks;
CREATE POLICY "delete_own_schedule_tasks"
ON user_schedule_tasks FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- 4. user_mentor_messages
CREATE TABLE IF NOT EXISTS user_mentor_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL DEFAULT '',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_mentor_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_mentor_messages" ON user_mentor_messages;
CREATE POLICY "select_own_mentor_messages"
ON user_mentor_messages FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_mentor_messages" ON user_mentor_messages;
CREATE POLICY "insert_own_mentor_messages"
ON user_mentor_messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_mentor_messages" ON user_mentor_messages;
CREATE POLICY "update_own_mentor_messages"
ON user_mentor_messages FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_mentor_messages" ON user_mentor_messages;
CREATE POLICY "delete_own_mentor_messages"
ON user_mentor_messages FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_question_history_user ON user_question_history(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_tasks_user ON user_schedule_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_messages_user ON user_mentor_messages(user_id);