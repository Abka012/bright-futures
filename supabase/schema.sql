-- Bright Futures Database Schema

-- Schools
CREATE TABLE IF NOT EXISTS public.schools (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text,
  city text,
  state text,
  contact_name text,
  contact_email text,
  contact_phone text,
  student_count integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access for schools" ON public.schools FOR ALL USING (true);

-- Volunteers
CREATE TABLE IF NOT EXISTS public.volunteers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  skills text[] DEFAULT '{}'::text[],
  availability text,
  hours_logged integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  join_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access for volunteers" ON public.volunteers FOR ALL USING (true);

-- Schedules
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name text,
  date date NOT NULL,
  time text,
  volunteer_ids uuid[] DEFAULT '{}'::uuid[],
  volunteer_names text[] DEFAULT '{}'::text[],
  type text DEFAULT 'workshop' CHECK (type IN ('campus-tour', 'workshop', 'mentoring', 'career-day')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access for schedules" ON public.schedules FOR ALL USING (true);

-- Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text DEFAULT 'corporate' CHECK (type IN ('corporate', 'nonprofit', 'government', 'educational')),
  contact_name text,
  contact_email text,
  phone text,
  contribution text,
  status text DEFAULT 'prospective' CHECK (status IN ('active', 'prospective', 'inactive')),
  since date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access for partners" ON public.partners FOR ALL USING (true);
