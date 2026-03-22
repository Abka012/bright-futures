# Component Architecture

The Component Diagram illustrates how the application's internal structure connects frontend components, UI libraries, and data layers.

## Architecture Overview

The App serves as the main entry point, coordinating three critical services: **BrowserRouter** for navigation, **AuthProvider** for authentication state, and **QueryClient** for data fetching. The **Layout** component arranges the interface using a **Sidebar** for navigation and an **Outlet** for rendering child pages.

## Module Structure

```
App
├── BrowserRouter (routing)
├── AuthProvider (authentication)
└── QueryClient (data fetching)
    ├── PostgreSQL (production data)
    └── demoData (demo mode fallback)

Layout
├── Sidebar (navigation)
└── Outlet (page renderer)
    ├── Schools
    ├── Partners
    ├── Volunteers
    ├── Schedules
    ├── Reports
    └── Dashboard
```

## Core Feature Modules

| Module | Purpose |
|--------|---------|
| **Schools** | Manage partner school information |
| **Partners** | Track partner organizations |
| **Volunteers** | Volunteer profiles and tracking |
| **Schedules** | Visit and event scheduling |
| **Reports** | Analytics and visualizations |
| **Dashboard** | Overview and metrics |

## UI Layer

All feature modules use **shadcn/ui** components for consistent styling and accessibility. This component library provides buttons, forms, dialogs, tables, and other reusable UI elements.

## Security

**ProtectedRoute** wraps authenticated routes, ensuring only logged-in users can access protected pages. Unauthenticated requests redirect to the login page.

## Data Flow

1. Pages request data via TanStack Query hooks
2. QueryClient routes requests to Supabase or demoData
3. Responses populate the UI reactively
