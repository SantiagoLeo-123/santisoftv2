/*
# SantiSOFT Profile System and Mentor Chats

## Overview
This migration creates a Netflix-style profile system (no email/password auth required)
and a dedicated mentor_chats table for syncing Mentor Inteligente conversations.
It also adds a `profile_id` column to the existing `user_lesson_progress` table
so lesson completion can be scoped to a profile rather than an auth user.

## New Tables

### 1. profiles
Stores user profiles like Netflix profile selection — anyone can create a profile
just by picking a name and avatar color. No email, no password.
- `id` (uuid PK)
- `name` (text, not null)
- `avatar` (text — stores a color hex or emoji identifier)
- `created_at` (timestamptz)

### 2. mentor_chats
Stores Mentor Inteligente conversation messages linked to a profile.
- `id` (uuid PK)
- `profile_id` (uuid, FK profiles, ON DELETE CASCADE)
- `role` (text — 'user' or 'assistant')
- `content` (text)
- `created_at` (timestamptz)

## Modified Tables

### user_lesson_progress
- Added `profile_id` (uuid, nullable, FK profiles ON DELETE SET NULL).
  When a profile_id is provided, lesson completion is scoped to that profile.
  The existing `user_id` column is retained for backward compatibility.

## Security
- RLS enabled on `profiles` and `mentor_chats`.
- All policies use `TO anon, authenticated` because there is NO sign-in screen —
  the app operates entirely as the anon role. Profiles are intentionally public/shared
  (anyone on this device can see and pick profiles).
- `USING (true)` is acceptable here because the data is intentionally shared across
  profiles on the same device (Netflix-style local profile selection).
- `user_lesson_progress` already has RLS enabled with user_id-scoped policies.
  The new profile_id column is nullable and does not change existing policies.

## Important Notes
1. The `profiles` table is intentionally open (anon can CRUD) because this app
   uses local profile selection, not Supabase Auth.
2. `mentor_chats` uses `profile_id` (not `user_id`) so chats are linked to profiles.
3. The existing `user_mentor_messages` table is NOT modified — `mentor_chats` is a
   separate table per the user's specification.
*/