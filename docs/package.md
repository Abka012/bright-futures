# Package Structure

The Package Diagram represents the codebase organization and module dependencies within the project.

## Source Directory Structure

```
src/
├── lib/               # Utilities and services
├── components/        # Reusable UI components
├── contexts/          # React Context providers
├── pages/             # Feature page components
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Module Organization

### lib/

Contains utility files and service connections:

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client with TypeScript types |
| `demoData.ts` | Sample data for demo mode |
| `utils.ts` | Utility functions (class merging, etc.) |

### components/

Reusable UI components:

| Component | Purpose |
|-----------|---------|
| `Layout` | App layout wrapper |
| `Sidebar` | Navigation sidebar |
| `ProtectedRoute` | Route protection |
| `StatCard` | Dashboard stat cards |
| `ui/*` | shadcn/ui component library (49 components) |

### contexts/

Global state management:

| Context | Purpose |
|---------|---------|
| `AuthContext` | Authentication state and methods |

### pages/

Feature page components:

| Page | Route | Description |
|------|-------|-------------|
| `Dashboard` | `/app` | Overview and metrics |
| `Schools` | `/app/schools` | School management |
| `Volunteers` | `/app/volunteers` | Volunteer management |
| `Schedules` | `/app/schedules` | Schedule management |
| `Partners` | `/app/partners` | Partner management |
| `Reports` | `/app/reports` | Analytics and charts |
| `Login` | `/login` | Authentication page |

## Data Flow

```
main.tsx
    │
    ▼
App.tsx
    │
    ├── uses
    │
    ├── pages/ ──────────► use TanStack Query ───┐
    │                   (useQuery/useMutation)   │
    │                                            │
    └── reads/writes                      ┌──────┴──────┐
                                          │             │
                                    Supabase       demoData
                                    (production)    (demo mode)
```

## Dependencies

Pages depend on:
- **TanStack Query** for data fetching
- **shadcn/ui components** for UI
- **Supabase client** for database access

The App component ties all modules together and receives input from the entry point (`main.tsx`).
