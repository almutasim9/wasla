-- Run this in the Supabase SQL Editor before using the split student flow.
-- It adds the two pre-account student tables:
-- student_applications -> student_pipeline -> students

create table if not exists student_applications (
    id text primary key,
    "fullName" text not null,
    gender text not null,
    phone text not null,
    area text not null,
    landmark text not null,
    university text not null,
    "universityLocation" text not null,
    shift text not null,
    stage text not null default 'new',
    status text not null default 'pending',
    "contactAttempts" integer not null default 0,
    "callLogs" jsonb not null default '[]'::jsonb,
    payments jsonb not null default '[]'::jsonb,
    timeline jsonb not null default '[]'::jsonb,
    "createdAt" text not null,
    passcode text
);

create table if not exists student_pipeline (
    id text primary key,
    "fullName" text not null,
    gender text not null,
    phone text not null,
    area text not null,
    landmark text not null,
    university text not null,
    "universityLocation" text not null,
    shift text not null,
    stage text not null default 'new',
    status text not null default 'pending',
    "contactAttempts" integer not null default 0,
    "callLogs" jsonb not null default '[]'::jsonb,
    payments jsonb not null default '[]'::jsonb,
    timeline jsonb not null default '[]'::jsonb,
    "createdAt" text not null,
    passcode text
);

alter table student_applications enable row level security;
alter table student_pipeline enable row level security;

drop policy if exists "Allow public student application inserts" on student_applications;
create policy "Allow public student application inserts"
on student_applications
for insert
to anon
with check (true);

drop policy if exists "Allow public student application reads" on student_applications;
create policy "Allow public student application reads"
on student_applications
for select
to anon
using (true);

drop policy if exists "Allow public student application updates" on student_applications;
create policy "Allow public student application updates"
on student_applications
for update
to anon
using (true)
with check (true);

drop policy if exists "Allow public student pipeline reads" on student_pipeline;
create policy "Allow public student pipeline reads"
on student_pipeline
for select
to anon
using (true);

drop policy if exists "Allow public student pipeline inserts" on student_pipeline;
create policy "Allow public student pipeline inserts"
on student_pipeline
for insert
to anon
with check (true);

drop policy if exists "Allow public student pipeline updates" on student_pipeline;
create policy "Allow public student pipeline updates"
on student_pipeline
for update
to anon
using (true)
with check (true);
