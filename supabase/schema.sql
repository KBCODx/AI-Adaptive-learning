-- ==============================================================================
-- GURUMITRA AI ADAPTIVE LEARNING SYSTEM - SUPABASE DATABASE SCHEMA & RLS
-- ==============================================================================

-- 1. Create the user profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  learning_level text not null check (learning_level in ('Beginner', 'Intermediate', 'Advanced')) default 'Intermediate',
  preferred_subjects text[] default array['Mathematics', 'Science'],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Row Level Security Policies
-- Users can only read their own profile
create policy "Users can view their own profile."
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can create their own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile."
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Automatically update 'updated_at' column on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 5. Automated trigger to create profile row when new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  pref_subs text[];
begin
  -- Safely extract preferred subjects json array into text array
  select array(
    select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'preferred_subjects', '["Mathematics", "Science"]'::jsonb))
  ) into pref_subs;

  insert into public.profiles (id, full_name, learning_level, preferred_subjects)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'learning_level', 'Intermediate'),
    case when array_length(pref_subs, 1) > 0 then pref_subs else array['Mathematics', 'Science'] end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    learning_level = excluded.learning_level,
    preferred_subjects = excluded.preferred_subjects,
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
