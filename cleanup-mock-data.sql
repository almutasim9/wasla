-- Run this in the Supabase SQL Editor to remove all app accounts and
-- sample/test data from the Wasla application tables.
--
-- This does not touch form_settings, so your registration form configuration
-- stays intact.

begin;

truncate table
    subscriptions,
    students,
    student_pipeline,
    student_applications,
    captains,
    pipeline_applications,
    captain_applications,
    admins
restart identity cascade;

commit;

-- Optional: create one real admin after cleanup so you can log in again.
-- Change the id/email/password before running this block.
--
-- insert into admins (id, "fullName", email, password, "createdAt")
-- values ('admin-main', 'مدير وصلة', 'admin@example.com', 'change-this-password', current_date::text);
