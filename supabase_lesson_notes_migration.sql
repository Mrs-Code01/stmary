-- ============================================================
-- SMCS Lesson Notes — Supabase SQL Migration (append to existing)
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- 8. Lesson Notes table
create table if not exists lesson_notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id text not null,
  class_id text not null,
  subject text not null,
  file_url text not null,
  file_name text not null,
  uploaded_at timestamptz default now()
);

-- Disable RLS for simplicity (match existing tables)
alter table lesson_notes disable row level security;

-- ============================================================
-- Storage bucket for lesson notes
-- ============================================================
insert into storage.buckets (id, name, public) values ('lesson_notes', 'lesson_notes', true) on conflict (id) do nothing;

-- Storage Policies
CREATE POLICY "Public Upload lesson_notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lesson_notes');
CREATE POLICY "Public Select lesson_notes" ON storage.objects FOR SELECT USING (bucket_id = 'lesson_notes');
