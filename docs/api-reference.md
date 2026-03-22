# API Reference

This document covers the Supabase client setup, TypeScript types, and CRUD patterns used throughout the application.

## Supabase Client

### Setup (`src/lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### TypeScript Database Types

The application defines TypeScript types that match the database schema:

```typescript
export type Database = {
  public: {
    Tables: {
      schools: {
        Row: { /* full row type */ };
        Insert: { /* insert type (without auto fields) */ };
        Update: { /* partial update type */ };
      };
      volunteers: {
        Row: { /* full row type */ };
        Insert: { /* insert type */ };
        Update: { /* partial update type */ };
      };
      schedules: {
        Row: { /* full row type */ };
        Insert: { /* insert type */ };
        Update: { /* partial update type */ };
      };
      partners: {
        Row: { /* full row type */ };
        Insert: { /* insert type */ };
        Update: { /* partial update type */ };
      };
    };
  };
};
```

## Data Fetching with TanStack Query

### Basic Fetch Pattern

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Simple fetch
const { data, isLoading, error } = useQuery({
  queryKey: ["schools"],
  queryFn: async () => {
    const { data } = await supabase.from("schools").select("*");
    return data || [];
  },
});
```

### Fetch with Filtering

```typescript
const { data } = useQuery({
  queryKey: ["schedules", dateRange],
  queryFn: async () => {
    const filterDate = getDateFilter();
    const { data } = await supabase
      .from("schedules")
      .select("*")
      .gte("date", filterDate)  // Greater than or equal
      .order("date");          // Sort by date
    return data || [];
  },
});
```

### Conditional Fetching

```typescript
const { data } = useQuery({
  queryKey: ["schools"],
  queryFn: async () => {
    try {
      const { data } = await supabase.from("schools").select("*");
      return data || [];
    } catch {
      return [];
    }
  },
  enabled: !isDemoMode,  // Only fetch when NOT in demo mode
});
```

## CRUD Operations

### Schools CRUD

#### Fetch All Schools

```typescript
const { data: schools } = await supabase
  .from("schools")
  .select("*")
  .order("name");
```

#### Fetch Single School

```typescript
const { data: school } = await supabase
  .from("schools")
  .select("*")
  .eq("id", schoolId)
  .single();
```

#### Create School

```typescript
const { error } = await supabase
  .from("schools")
  .insert({
    name: "Lincoln High School",
    address: "123 Education Ave",
    city: "Springfield",
    state: "IL",
    contact_name: "Sarah Johnson",
    contact_email: "sjohnson@lincoln.edu",
    contact_phone: "555-0101",
    student_count: 1250,
    status: "active",
    notes: "Strong STEM program"
  });

if (error) {
  console.error("Error creating school:", error);
}
```

#### Update School

```typescript
const { error } = await supabase
  .from("schools")
  .update({
    name: "Updated School Name",
    status: "active"
  })
  .eq("id", schoolId);

if (error) {
  console.error("Error updating school:", error);
}
```

#### Delete School

```typescript
const { error } = await supabase
  .from("schools")
  .delete()
  .eq("id", schoolId);

if (error) {
  console.error("Error deleting school:", error);
}
```

### Volunteers CRUD

#### Fetch Volunteers with Skills Filter

```typescript
// Fetch all volunteers
const { data: volunteers } = await supabase
  .from("volunteers")
  .select("*")
  .order("name");

// Fetch active volunteers only
const { data: activeVolunteers } = await supabase
  .from("volunteers")
  .select("*")
  .eq("status", "active");
```

#### Create Volunteer

```typescript
const { error } = await supabase
  .from("volunteers")
  .insert({
    name: "Alex Thompson",
    email: "alex.t@email.com",
    phone: "555-1001",
    skills: ["Mentoring", "Career Guidance"],
    availability: "Weekends",
    hours_logged: 0,
    status: "active",
    join_date: "2024-01-15"
  });
```

#### Update Volunteer Hours

```typescript
const { error } = await supabase
  .from("volunteers")
  .update({
    hours_logged: 85
  })
  .eq("id", volunteerId);
```

### Schedules CRUD

#### Fetch Schedules with Date Filter

```typescript
const { data: schedules } = await supabase
  .from("schedules")
  .select("*")
  .gte("date", "2024-01-01")      // From date
  .lte("date", "2024-12-31")      // To date
  .order("date", { ascending: true });
```

#### Create Schedule with Volunteers

```typescript
const { error } = await supabase
  .from("schedules")
  .insert({
    school_id: "uuid-of-school",
    school_name: "Lincoln High School",
    date: "2024-03-15",
    time: "09:00",
    volunteer_ids: ["volunteer-uuid-1", "volunteer-uuid-2"],
    volunteer_names: ["Alex Thompson", "Taylor Kim"],
    type: "career-day",
    status: "scheduled",
    notes: "Annual career fair"
  });
```

#### Update Schedule Status

```typescript
// Mark as completed
const { error } = await supabase
  .from("schedules")
  .update({ status: "completed" })
  .eq("id", scheduleId);

// Cancel schedule
const { error } = await supabase
  .from("schedules")
  .update({ status: "cancelled" })
  .eq("id", scheduleId);
```

### Partners CRUD

#### Fetch Partners by Type

```typescript
// Fetch corporate partners
const { data: corporatePartners } = await supabase
  .from("partners")
  .select("*")
  .eq("type", "corporate")
  .eq("status", "active");
```

#### Create Partner

```typescript
const { error } = await supabase
  .from("partners")
  .insert({
    name: "TechCorp Industries",
    type: "corporate",
    contact_name: "John Smith",
    contact_email: "jsmith@techcorp.com",
    phone: "555-2001",
    contribution: "Annual sponsorship $50000",
    status: "active",
    since: "2023-01-15"
  });
```

## Mutations with TanStack Query

### Create Mutation Pattern

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: async (data: NewSchoolData) => {
    const { error } = await supabase.from("schools").insert(data);
    if (error && error.code !== "PGRST116") throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    toast.success("School added successfully");
  },
  onError: (error) => {
    toast.error("Failed to add school");
  },
});

// Usage
createMutation.mutate(newSchoolData);
```

### Update Mutation Pattern

```typescript
const updateMutation = useMutation({
  mutationFn: async ({ id, data }: { id: string; data: Partial<School> }) => {
    const { error } = await supabase.from("schools").update(data).eq("id", id);
    if (error && error.code !== "PGRST116") throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    toast.success("School updated successfully");
  },
});

// Usage
updateMutation.mutate({ id: "school-id", data: updatedData });
```

### Delete Mutation Pattern

```typescript
const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error && error.code !== "PGRST116") throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    toast.success("School deleted successfully");
  },
});

// Usage
deleteMutation.mutate("school-id");
```

## Authentication API

### Sign In

```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123"
});
```

### Sign Up

```typescript
const { error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
  options: {
    data: {
      full_name: "John Doe"
    }
  }
});
```

### Sign Out

```typescript
await supabase.auth.signOut();
```

### Get Current Session

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

### Auth State Change Listener

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    console.log("User signed in:", session?.user);
  } else if (event === "SIGNED_OUT") {
    console.log("User signed out");
  }
});

// Cleanup on unmount
return () => subscription.unsubscribe();
```

## Query Building Examples

### Filter Operators

```typescript
// Equal
supabase.from("schools").select("*").eq("status", "active")

// Not equal
supabase.from("schools").select("*").neq("status", "inactive")

// Greater than
supabase.from("schedules").select("*").gt("date", "2024-01-01")

// Less than or equal
supabase.from("schedules").select("*").lte("hours_logged", 100)

// Like (pattern matching)
supabase.from("schools").select("*").like("name", "%High%")

// In
supabase.from("schools").select("*").in("status", ["active", "pending"])
```

### Ordering

```typescript
// Ascending
supabase.from("schools").select("*").order("name")

// Descending
supabase.from("volunteers").select("*").order("hours_logged", { ascending: false })

// Multiple columns
supabase.from("schedules").select("*")
  .order("date", { ascending: true })
  .order("time", { ascending: true })
```

### Pagination

```typescript
// Limit results
supabase.from("volunteers").select("*").limit(10)

// Offset (for pagination)
supabase.from("volunteers").select("*").range(0, 9)  // First 10
supabase.from("volunteers").select("*").range(10, 19) // Next 10
```

## Error Handling

### Error Codes Reference

| Code | Description |
|------|-------------|
| `PGRST116` | No rows found (for single row queries) |
| `23505` | Unique constraint violation |
| `23503` | Foreign key constraint violation |
| `23502` | NOT NULL constraint violation |

### Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase.from("schools").insert(data);
  
  if (error) {
    if (error.code === "23505") {
      console.error("School with this name already exists");
    } else if (error.code === "23503") {
      console.error("Referenced record does not exist");
    } else {
      console.error("Database error:", error.message);
    }
  }
} catch (e) {
  console.error("Unexpected error:", e);
}
```
