# Database Schema

Bright Futures uses Supabase (PostgreSQL) as its database backend. This document outlines the schema, tables, and relationships.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────────────┐   1:N(one-to-many)   ┌─────────────────┐             │
│    │     schools     │◄─────────────────────│   schedules     │             │
│    ├─────────────────┤                      ├─────────────────┤             │
│    │ id (PK)         │                      │ id (PK)         │             │
│    │ name            │                      │ school_id (FK)  │──────────┐  │
│    │ address         │                      │ school_name     │          │  │
│    │ city            │                      │ date            │          │  │
│    │ state           │                      │ time            │          │  │
│    │ contact_name    │                      │ volunteer_ids[] │          │  │
│    │ contact_email   │                      │ volunteer_names │          │  │
│    │ contact_phone   │                      │ type            │          │  │
│    │ student_count   │                      │ status          │          │  │
│    │ status          │                      │ notes           │          │  │
│    │ notes           │                      │ created_at      │          │  │
│    │ created_at      │                      │ updated_at      │          │  │
│    │ updated_at      │                      └─────────────────┘          │  │
│    └─────────────────┘                                                   │  │
│                                                                          │  │
│    ┌─────────────────┐   N:M(many-to-many)  ┌─────────────────┐          │  │
│    │   volunteers    │◄─────────────────────│   schedules     │          │  │
│    ├─────────────────┤    (via arrays)      ├─────────────────┤          │  │
│    │ id (PK)         │                      │ volunteer_ids[] │──────────┘  │
│    │ name            │                      │ volunteer_names │             │
│    │ email           │                      └─────────────────┘             │
│    │ phone           │                                                      │
│    │ skills[]        │                                                      │
│    │ availability    │                                                      │
│    │ hours_logged    │                                                      │
│    │ status          │                                                      │
│    │ join_date       │                                                      │
│    │ created_at      │                                                      │
│    │ updated_at      │                                                      │
│    └─────────────────┘                                                      │
│                                                                             │
│    ┌─────────────────┐                                                      │
│    │    partners     │                                                      │
│    ├─────────────────┤                                                      │
│    │ id (PK)         │                                                      │
│    │ name            │                                                      │
│    │ type            │                                                      │
│    │ contact_name    │                                                      │
│    │ contact_email   │                                                      │
│    │ phone           │                                                      │
│    │ contribution    │                                                      │
│    │ status          │                                                      │
│    │ since           │                                                      │
│    │ created_at      │                                                      │
│    │ updated_at      │                                                      │
│    └─────────────────┘                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tables

### 1. Schools

Stores information about partner schools.

```sql
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `name` | text | NOT NULL | School name |
| `address` | text | - | Street address |
| `city` | text | - | City |
| `state` | text | - | State |
| `contact_name` | text | - | Primary contact person |
| `contact_email` | text | - | Contact email |
| `contact_phone` | text | - | Contact phone |
| `student_count` | integer | default 0 | Number of students |
| `status` | text | CHECK ('active', 'pending', 'inactive') | Partnership status |
| `notes` | text | - | Additional notes |
| `created_at` | timestamptz | default now() | Creation timestamp |
| `updated_at` | timestamptz | default now() | Last update timestamp |

### 2. Volunteers

Stores volunteer profiles and information.

```sql
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `name` | text | NOT NULL | Volunteer name |
| `email` | text | - | Email address |
| `phone` | text | - | Phone number |
| `skills` | text[] | default '{}' | Array of skills |
| `availability` | text | - | Availability schedule |
| `hours_logged` | integer | default 0 | Total hours contributed |
| `status` | text | CHECK ('active', 'inactive') | Active status |
| `join_date` | date | - | Date joined |
| `created_at` | timestamptz | default now() | Creation timestamp |
| `updated_at` | timestamptz | default now() | Last update timestamp |

### 3. Schedules

Stores scheduled visits and events.

```sql
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `school_id` | uuid | FK → schools(id) | Associated school |
| `school_name` | text | - | Denormalized school name |
| `date` | date | NOT NULL | Visit date |
| `time` | text | - | Visit time |
| `volunteer_ids` | uuid[] | default '{}' | Assigned volunteer IDs |
| `volunteer_names` | text[] | default '{}' | Denormalized volunteer names |
| `type` | text | CHECK (campus-tour, workshop, mentoring, career-day) | Event type |
| `status` | text | CHECK (scheduled, completed, cancelled) | Visit status |
| `notes` | text | - | Additional notes |
| `created_at` | timestamptz | default now() | Creation timestamp |
| `updated_at` | timestamptz | default now() | Last update timestamp |

### 4. Partners

Stores partner organization information.

```sql
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `name` | text | NOT NULL | Partner organization name |
| `type` | text | CHECK (corporate, nonprofit, government, educational) | Organization type |
| `contact_name` | text | - | Primary contact |
| `contact_email` | text | - | Contact email |
| `phone` | text | - | Phone number |
| `contribution` | text | - | Contribution description |
| `status` | text | CHECK (active, prospective, inactive) | Partnership status |
| `since` | date | - | Partnership start date |
| `created_at` | timestamptz | default now() | Creation timestamp |
| `updated_at` | timestamptz | default now() | Last update timestamp |

## Row Level Security

All tables have Row Level Security (RLS) enabled with public access policies:

```sql
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access for schools" ON public.schools FOR ALL USING (true);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access for volunteers" ON public.volunteers FOR ALL USING (true);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access for schedules" ON public.schedules FOR ALL USING (true);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access for partners" ON public.partners FOR ALL USING (true);
```

## Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| schools → schedules | 1:N | One school can have many scheduled visits |
| schedules → volunteers | N:M | Many volunteers can be assigned to one schedule (via arrays) |

## Data Types Reference

| Type | PostgreSQL | TypeScript |
|------|-----------|------------|
| UUID | `uuid` | `string` |
| Text | `text` | `string` |
| Integer | `integer` | `number` |
| Boolean | `boolean` | `boolean` |
| Date | `date` | `string` (ISO date) |
| Timestamp | `timestamptz` | `string` (ISO datetime) |
| Array | `text[]`, `uuid[]` | `string[]` |

## Enums

| Enum | Values |
|------|--------|
| `school_status` | 'active', 'pending', 'inactive' |
| `volunteer_status` | 'active', 'inactive' |
| `schedule_type` | 'campus-tour', 'workshop', 'mentoring', 'career-day' |
| `schedule_status` | 'scheduled', 'completed', 'cancelled' |
| `partner_type` | 'corporate', 'nonprofit', 'government', 'educational' |
| `partner_status` | 'active', 'prospective', 'inactive' |
