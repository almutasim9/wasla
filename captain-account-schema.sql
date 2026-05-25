-- Run this in the Supabase SQL Editor if accepting a captain does not create
-- a row in the captains table.

alter table captains add column if not exists passcode text;
alter table captains add column if not exists "accountStatus" text default 'active';
alter table captains add column if not exists "approvedAt" text;

alter table captains enable row level security;

drop policy if exists "Allow public captain reads" on captains;
create policy "Allow public captain reads"
on captains
for select
to anon
using (true);

drop policy if exists "Allow public captain inserts" on captains;
create policy "Allow public captain inserts"
on captains
for insert
to anon
with check (true);

drop policy if exists "Allow public captain updates" on captains;
create policy "Allow public captain updates"
on captains
for update
to anon
using (true)
with check (true);
