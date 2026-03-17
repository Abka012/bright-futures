-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Schools table
create table public.schools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  city text,
  state text,
  contact_name text,
  contact_email text,
  contact_phone text,
  student_count integer default 0,
  status text default 'pending' check (status in ('active', 'pending', 'inactive')),
  last_visit date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.schools enable row level security;

create policy "Authenticated users can view schools" on public.schools
  for select to authenticated using (true);

create policy "Authenticated users can insert schools" on public.schools
  for insert to authenticated with check (true);

create policy "Authenticated users can update schools" on public.schools
  for update to authenticated using (true);

create policy "Authenticated users can delete schools" on public.schools
  for delete to authenticated using (true);

-- Volunteers table
create table public.volunteers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  skills text[] default '{}',
  availability text,
  hours_logged integer default 0,
  status text default 'active' check (status in ('active', 'inactive')),
  join_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.volunteers enable row level security;

create policy "Authenticated users can view volunteers" on public.volunteers
  for select to authenticated using (true);

create policy "Authenticated users can insert volunteers" on public.volunteers
  for insert to authenticated with check (true);

create policy "Authenticated users can update volunteers" on public.volunteers
  for update to authenticated using (true);

create policy "Authenticated users can delete volunteers" on public.volunteers
  for delete to authenticated using (true);

-- Schedules table
create table public.schedules (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) on delete cascade,
  school_name text,
  date date not null,
  time text,
  volunteer_ids uuid[] default '{}',
  volunteer_names text[] default '{}',
  type text default 'workshop' check (type in ('campus-tour', 'workshop', 'mentoring', 'career-day')),
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.schedules enable row level security;

create policy "Authenticated users can view schedules" on public.schedules
  for select to authenticated using (true);

create policy "Authenticated users can insert schedules" on public.schedules
  for insert to authenticated with check (true);

create policy "Authenticated users can update schedules" on public.schedules
  for update to authenticated using (true);

create policy "Authenticated users can delete schedules" on public.schedules
  for delete to authenticated using (true);

-- Partners table
create table public.partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text default 'corporate' check (type in ('corporate', 'nonprofit', 'government', 'educational')),
  contact_name text,
  contact_email text,
  phone text,
  contribution text,
  status text default 'prospective' check (status in ('active', 'prospective', 'inactive')),
  since date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.partners enable row level security;

create policy "Authenticated users can view partners" on public.partners
  for select to authenticated using (true);

create policy "Authenticated users can insert partners" on public.partners
  for insert to authenticated with check (true);

create policy "Authenticated users can update partners" on public.partners
  for update to authenticated using (true);

create policy "Authenticated users can delete partners" on public.partners
  for delete to authenticated using (true);

-- Storage bucket for files (if needed)
insert into storage.buckets (id, name, public) values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "Authenticated users can view documents" on storage.objects
  for select to authenticated using (bucket_id = 'documents');

create policy "Authenticated users can upload documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents');

create policy "Authenticated users can delete documents" on storage.objects
  for delete to authenticated using (bucket_id = 'documents');