# Bright Futures

A centralized web-based management system for managing schools, volunteers, schedules, and partner organizations.

## Project Overview

Bright Futures streamlines the management of educational outreach programs by securely storing all operational data in one place. The system streamlines scheduling, reduces data duplication, improves communication among stakeholders, and provides reporting tools to support better decision-making.

## Features

- **Schools Management** - Track partner schools, contact information, student counts, and status
- **Volunteers Management** - Manage volunteer profiles, skills, availability, and hours logged
- **Schedule Management** - Create and track school visits, workshops, campus tours, and mentoring sessions
- **Partners Management** - Track corporate, nonprofit, government, and educational partners
- **Dashboard** - Overview with key metrics and upcoming visits
- **Reports** - Visual analytics with charts and date filtering (7/30/90 days)
- **Demo Mode** - Try the app without a Supabase account using built-in sample data
- **Authentication** - User sign up and sign in via Supabase Auth

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase project (optional for demo mode)

## How to Run Locally

### Option 1: With Supabase (Full Features)

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bright-futures
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor and run the schema from `supabase/schema.sql`
   - Go to Project Settings > API to get your URL and anon key

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:8080`

### Option 2: Demo Mode (No Supabase Required)

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bright-futures
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Click "Try Demo"** on the login page to explore with sample data

## Project Structure

```
bright-futures/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AppSidebar.tsx     # Navigation sidebar
│   │   ├── Layout.tsx         # App layout with sidebar
│   │   ├── NavLink.tsx        # Custom nav link component
│   │   └── ProtectedRoute.tsx # Auth protection
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── demoData.ts        # Built-in demo data
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Schools.tsx        # Schools CRUD
│   │   ├── Volunteers.tsx     # Volunteers CRUD
│   │   ├── Schedules.tsx      # Schedules CRUD
│   │   ├── Partners.tsx       # Partners CRUD
│   │   ├── Reports.tsx        # Reports & analytics
│   │   └── Login.tsx          # Login page
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── supabase/
│   └── schema.sql             # Database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Database Schema

The database has four main tables:
- **schools** - Partner school information
- **volunteers** - Volunteer profiles
- **schedules** - Scheduled visits and events
- **partners** - Partner organizations

See `supabase/schema.sql` for the complete schema definition.

## Demo Data

The demo mode includes sample data with dates spread across 7, 30, and 90 days to demonstrate the date filtering feature. You can filter dashboard and reports by:
- Last 7 days
- Last 30 days
- Last 90 days
