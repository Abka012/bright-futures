# Deployment Architecture

The Deployment Diagram shows how the system is physically deployed and how components communicate across environments in production.

## Production Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Browser   │────►│    CDN      │────►│  Static Assets  │
│  (User)     │◄────│  (Hosting)  │◄────│  JS/CSS/Fonts   │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                                       │
       │         ┌─────────────────┐           │
       └────────►│    Supabase     │◄──────────┘
                 │                 │
                 │  ┌───────────┐  │
                 │  │ REST API  │  │
                 │  │ Auth API  │  │
                 │  │ Realtime  │  │
                 │  └───────────┘  │
                 └───────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌───────────┐   ┌──────────┐
    │PostgreSQL│   │auth.users │   │ Storage  │
    └──────────┘   └───────────┘   └──────────┘
```

## Frontend Deployment

The React SPA runs in the user's browser. Static assets (JavaScript, CSS, fonts, icons) are served via a CDN for optimal performance and caching.

## Supabase Backend

Supabase provides the backend infrastructure:

| Service | Description |
|---------|-------------|
| **REST API** | CRUD operations for schools, volunteers, schedules, partners |
| **Auth API** | User authentication and session management |
| **Realtime** | Live data subscriptions (optional) |

## External Services

External resources are loaded separately:

- **Google Fonts** - Playfair Display, DM Sans typography
- **Lucide Icons** - Icon library for UI elements

## Database Layer

Supabase connects to managed PostgreSQL with:

- **PostgreSQL** - Primary database for all application data
- **auth.users** - User accounts and authentication
- **Storage** - File storage for uploads (if needed)
