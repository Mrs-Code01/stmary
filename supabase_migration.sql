-- ============================================================
-- SMCS School Management System — Supabase SQL Migration
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- 1. Students table
create table if not exists students (
  id text primary key,
  full_name text not null,
  password text not null,
  class_id text not null,
  tech_course text,
  tech_course_started_at timestamptz,
  avatar_url text,
  dream_job text,
  current_learning text,
  daily_effort text
);

-- 2. Teachers table
create table if not exists teachers (
  id text primary key,
  password text not null,
  class_id text not null
);

-- 3. Assignments table (school_assignment or tech_assessment)
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  class_id text not null,
  subject text not null,
  type text not null check (type in ('school_assignment', 'tech_assessment')),
  questions jsonb not null default '[]',
  month integer default 1,
  created_at timestamptz default now()
);

-- 4. Results table (PDF links per student)
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  class_id text not null,
  pdf_url text not null,
  uploaded_at timestamptz default now()
);

-- 5. Submissions table (student answers + score)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  assignment_id uuid not null,
  answers jsonb not null default '{}',
  score integer not null default 0,
  submitted_at timestamptz default now()
);

-- 6. Assessment dates table
create table if not exists assessment_dates (
  id uuid primary key default gen_random_uuid(),
  class_id text not null,
  teacher_id text not null,
  assessment_date date not null,
  label text
);

-- ============================================================
-- 7. Storage bucket for PDF results
-- Run this AFTER creating the tables
-- ============================================================
-- Storage bucket for PDFs and Avatars
insert into storage.buckets (id, name, public) values ('results', 'results', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;

-- Storage Policies (Dev Mode)
CREATE POLICY "Public Upload results" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'results');
CREATE POLICY "Public Select results" ON storage.objects FOR SELECT USING (bucket_id = 'results');

CREATE POLICY "Public Upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public Select avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

-- ============================================================
-- 8. Row Level Security (RLS) — DISABLE for simplicity
--    In production, enable RLS and add proper policies
-- ============================================================
alter table students disable row level security;
alter table teachers disable row level security;
alter table assignments disable row level security;
alter table results disable row level security;
alter table submissions disable row level security;
alter table assessment_dates disable row level security;
