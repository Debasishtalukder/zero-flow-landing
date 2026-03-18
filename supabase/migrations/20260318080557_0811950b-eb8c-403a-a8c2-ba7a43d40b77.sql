
-- profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- routine_config table
create table public.routine_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  sleep_hours numeric default 8,
  meal_hours numeric default 1,
  gaming_hours numeric default 2,
  other_hours numeric default 2,
  unique(user_id)
);

-- tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text default 'habit',
  duration_min integer default 30,
  total_days integer default 30,
  start_date date default current_date,
  color text default '#E8FDF5',
  created_at timestamptz default now()
);

-- task_logs table
create table public.task_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date default current_date,
  status text not null,
  unique(task_id, date)
);

-- roadmaps table
create table public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  target_date date,
  progress_percent integer default 0,
  created_at timestamptz default now()
);

-- milestones table
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references public.roadmaps(id) on delete cascade not null,
  title text not null,
  due_date date,
  completed boolean default false
);

-- RLS policies for profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- RLS policies for routine_config
create policy "Users can view own routine" on public.routine_config for select using (auth.uid() = user_id);
create policy "Users can update own routine" on public.routine_config for update using (auth.uid() = user_id);
create policy "Users can insert own routine" on public.routine_config for insert with check (auth.uid() = user_id);

-- RLS policies for tasks
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- RLS policies for task_logs
create policy "Users can view own logs" on public.task_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.task_logs for insert with check (auth.uid() = user_id);

-- RLS policies for roadmaps
create policy "Users can view own roadmaps" on public.roadmaps for select using (auth.uid() = user_id);
create policy "Users can insert own roadmaps" on public.roadmaps for insert with check (auth.uid() = user_id);
create policy "Users can update own roadmaps" on public.roadmaps for update using (auth.uid() = user_id);
create policy "Users can delete own roadmaps" on public.roadmaps for delete using (auth.uid() = user_id);

-- Security definer function for milestone ownership check
create or replace function public.owns_roadmap(_roadmap_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.roadmaps
    where id = _roadmap_id and user_id = auth.uid()
  )
$$;

-- RLS policies for milestones
create policy "Users can view own milestones" on public.milestones for select using (public.owns_roadmap(roadmap_id));
create policy "Users can insert own milestones" on public.milestones for insert with check (public.owns_roadmap(roadmap_id));
create policy "Users can update own milestones" on public.milestones for update using (public.owns_roadmap(roadmap_id));
create policy "Users can delete own milestones" on public.milestones for delete using (public.owns_roadmap(roadmap_id));

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
