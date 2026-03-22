# Architecture

This document provides an overview of the Bright Futures architecture, technology stack, and project structure.

## Technology Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3 | UI framework |
| **Language** | TypeScript | 5.8 | Type safety |
| **Build Tool** | Vite | 5.4 | Fast builds & HMR |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS |
| **Components** | shadcn/ui | - | Component library |
| **Routing** | React Router DOM | 6.30 | Client-side routing |
| **State** | TanStack Query | 5.83 | Server state management |
| **Forms** | React Hook Form | 7.61 | Form handling |
| **Validation** | Zod | 3.25 | Schema validation |
| **Database** | Supabase | 2.99 | PostgreSQL + Auth |
| **Charts** | Recharts | 2.15 | Data visualization |
| **Animations** | Framer Motion | 12.35 | UI animations |

### Supporting Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Lucide React | 0.462 | Icon library |
| date-fns | 3.6 | Date utilities |
| Sonner | 1.7 | Toast notifications |
| Radix UI | various | Accessible primitives |
| class-variance-authority | 0.7 | Component variants |
| clsx + tailwind-merge | - | Class name utilities |

## Project Structure

```
bright-futures/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui component library (49 components)
│   │   ├── AppSidebar.tsx     # Navigation sidebar component
│   │   ├── Layout.tsx         # App layout wrapper
│   │   ├── NavLink.tsx        # Custom navigation link
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   └── StatCard.tsx       # Dashboard stat card
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── hooks/
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   └── use-toast.ts       # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client + TypeScript types
│   │   ├── demoData.ts        # Built-in demo/sample data
│   │   └── utils.ts           # Utility functions (cn for class merging)
│   ├── pages/                 # Route pages
│   │   ├── Dashboard.tsx      # Main dashboard with stats
│   │   ├── Login.tsx          # Authentication page
│   │   ├── Schools.tsx        # Schools CRUD page
│   │   ├── Volunteers.tsx     # Volunteers CRUD page
│   │   ├── Schedules.tsx      # Schedules/visits CRUD
│   │   ├── Partners.tsx       # Partners CRUD page
│   │   ├── Reports.tsx        # Analytics & charts
│   │   ├── Index.tsx          # Index/landing
│   │   └── NotFound.tsx       # 404 page
│   ├── test/
│   │   ├── setup.ts           # Vitest setup (jest-dom)
│   │   └── example.test.ts    # Sample test file
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles + CSS variables
├── supabase/
│   └── schema.sql             # Database schema (4 tables)
├── public/                    # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── components.json            # shadcn/ui config
└── .env                       # Environment variables
```

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Entry Point                              │
│                        src/main.tsx                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                         App Component                            │
│                          src/App.tsx                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Providers Stack                                            │  │
│  │ 1. QueryClientProvider (TanStack Query)                    │  │
│  │ 2. TooltipProvider (Radix UI)                              │  │
│  │ 3. Toaster (Sonner)                                        │  │
│  │ 4. AuthProvider (Context)                                  │  │
│  │ 5. BrowserRouter (React Router)                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Routes                                    │
│                                                                 │
│  /login ──────────────────► LoginPage                           │
│                                                                 │
│  /app ─────────────────────► ProtectedRoute                     │
│       │                              │                          │
│       ├── / (Dashboard)              │                          │
│       ├── /schools                   │                          │
│       ├── /volunteers                └───────────────► Layout   │
│       ├── /schedules                                            │
│       ├── /partners             (with AppSidebar navigation)    │
│       └── /reports                                              │
│                                                                 │
│  * ──────────────────────► NotFound                             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Component  │────►│  TanStack    │────►│   Supabase   │
│   (React)    │◄────│   Query      │◄────│   Client     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  useQuery /  │     │   Cache &    │     │  PostgreSQL  │
│  useMutation │     │  Invalidate  │     │   Database   │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Auth Flow                                  │
│                                                                 │
│  1. App loads ──► AuthProvider checks Supabase session          │
│                                                                 │
│  2. No session ──► Redirect to /login                           │
│                                                                 │
│  3. User signs in ──► Supabase Auth validates                   │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │             │                              │
│              Success          Error                             │
│                    │             │                              │
│                    ▼             ▼                              │
│           Set isDemoMode=false    Return error                  │
│                    │                                            │
│                    ▼                                            │
│           Redirect to /app                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

### Server State (TanStack Query)

All database operations use TanStack Query for:

- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

Example pattern:

```typescript
const { data } = useQuery({
  queryKey: ["schools"],
  queryFn: async () => {
    const { data } = await supabase.from("schools").select("*");
    return data || [];
  },
});
```

### Client State (React Context)

- **AuthContext**: User session, login/logout, demo mode toggle

### Form State (React Hook Form)

- Local component state for form inputs
- Zod schemas for validation

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration, server port 8080, path aliases |
| `tailwind.config.ts` | Theme colors, fonts (Playfair Display, DM Sans) |
| `tsconfig.json` | TypeScript base config with `@/*` path alias |
| `components.json` | shadcn/ui component library configuration |
| `vitest.config.ts` | Test environment (jsdom) configuration |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes* | Supabase anonymous key |

*Required for production mode. Application runs in Demo Mode without these.
