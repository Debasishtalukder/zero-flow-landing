-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  user_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; -- Users table in auth schema usually handles this but we will just run it.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create unified policies
CREATE POLICY "Users can only access their own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can only access their own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only access their own task logs" ON public.task_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only access their own roadmaps" ON public.roadmaps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Note: Milestones don't have user_id, they have roadmap_id. So policy needs to join to roadmaps.
-- Actually, the user asked for ALL tables, but milestones might need special handling. Let's check table definition.
-- Let's just create a basic one for milestones using subquery.
CREATE POLICY "Users can only access their own milestones" ON public.milestones FOR ALL USING (
  roadmap_id IN (SELECT id FROM public.roadmaps WHERE user_id = auth.uid())
) WITH CHECK (
  roadmap_id IN (SELECT id FROM public.roadmaps WHERE user_id = auth.uid())
);
CREATE POLICY "Users can only access their own routine config" ON public.routine_config FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only access their own mood logs" ON public.mood_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only access their own journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only access their own user settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Waitlist public insert" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Waitlist user read" ON public.waitlist FOR SELECT USING (auth.uid() = user_id);
