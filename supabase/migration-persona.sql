-- Run this once if you already created companion_profiles with the original schema.
-- Adds the generated-persona column. Non-destructive.
alter table companion_profiles add column if not exists persona text;
