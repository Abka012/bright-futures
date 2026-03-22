# Components

This document covers the UI component library and key application components.

## shadcn/ui Component Library

Bright Futures uses [shadcn/ui](https://ui.shadcn.com/), a collection of reusable components built on Radix UI primitives.

### Component Library Location

All UI components are located in `src/components/ui/`:

```
src/components/ui/
├── button.tsx
├── input.tsx
├── dialog.tsx
├── table.tsx
├── card.tsx
├── badge.tsx
├── select.tsx
├── textarea.tsx
├── form.tsx
├── toast.tsx
├── alert-dialog.tsx
├── calendar.tsx
├── dropdown-menu.tsx
├── sheet.tsx
├── sidebar.tsx
├── tooltip.tsx
├── chart.tsx
├── ... (49 total components)
```

### Commonly Used Components

| Component | Purpose | Import |
|-----------|---------|--------|
| `Button` | Clickable actions | `@/components/ui/button` |
| `Input` | Text input fields | `@/components/ui/input` |
| `Select` | Dropdown selection | `@/components/ui/select` |
| `Dialog` | Modal dialogs | `@/components/ui/dialog` |
| `Table` | Data tables | `@/components/ui/table` |
| `Badge` | Status labels | `@/components/ui/badge` |
| `Card` | Content containers | `@/components/ui/card` |
| `Textarea` | Multi-line input | `@/components/ui/textarea` |

### Button Variants

```typescript
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Input Component

```typescript
import { Input } from "@/components/ui/input";

// Basic usage
<Input placeholder="Enter text..." />

// With label
<div className="grid gap-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter name..." />
</div>

// Disabled state
<Input disabled placeholder="Disabled input" />
```

### Dialog (Modal)

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MyDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          Dialog content goes here
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

### Table Component

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.status === "active" ? "default" : "secondary"}>
            {item.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Select Component

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const [value, setValue] = useState("");

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

## Key Application Components

### AuthContext (`src/contexts/AuthContext.tsx`)

Provides authentication state management throughout the application.

#### Provider Setup

```typescript
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <AuthProvider>
    <YourApp />
  </AuthProvider>
);
```

#### Usage in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { user, session, isDemoMode, signIn, signUp, signOut, signInDemo } = useAuth();

  // Access user info
  console.log("User:", user?.email);
  
  // Check demo mode
  if (isDemoMode) {
    return <DemoModeUI />;
  }
  
  return <ProductionUI />;
};
```

#### AuthContext API

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `session` | `Session \| null` | Current session |
| `loading` | `boolean` | Auth loading state |
| `isDemoMode` | `boolean` | Whether demo mode is active |
| `signIn(email, password)` | `Promise<{ error }>` | Sign in with credentials |
| `signUp(email, password, name)` | `Promise<{ error }>` | Create new account |
| `signInDemo()` | `void` | Enter demo mode |
| `signOut()` | `Promise<void>` | Sign out |

### Layout (`src/components/Layout.tsx`)

Main application layout wrapper with sidebar navigation.

#### Usage

```typescript
import { Layout } from "@/components/Layout";

const App = () => (
  <Layout>
    <Dashboard />
  </Layout>
);
```

### AppSidebar (`src/components/AppSidebar.tsx`)

Navigation sidebar with links to all pages.

#### Navigation Items

| Path | Label | Icon |
|------|-------|------|
| `/app` | Dashboard | LayoutDashboard |
| `/app/schools` | Schools | School |
| `/app/volunteers` | Volunteers | Users |
| `/app/schedules` | Schedules | Calendar |
| `/app/partners` | Partners | Handshake |
| `/app/reports` | Reports | BarChart3 |

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)

Route wrapper that requires authentication.

#### Usage

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";

<Route
  path="/app"
  element={
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  }
>
```

### StatCard (`src/components/StatCard.tsx`)

Dashboard statistic card component.

#### Props

```typescript
interface StatCardProps {
  title: string;        // Card title
  value: number;        // Statistic value
  icon: LucideIcon;    // Icon component from lucide-react
}
```

#### Usage

```typescript
import { StatCard } from "@/components/StatCard";
import { School, Users } from "lucide-react";

<StatCard title="Active Schools" value={12} icon={School} />
<StatCard title="Volunteers" value={15} icon={Users} />
```

### Toast Notifications

Uses Sonner for toast notifications.

```typescript
import { toast } from "sonner";

// Success
toast.success("School added successfully");

// Error
toast.error("Failed to save changes");

// Info
toast.info("This action is not available in demo mode");
```

## Form Patterns

### Controlled Form with React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <Input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### Alert Dialog for Deletions

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeleteConfirmation = ({ open, onOpenChange, onConfirm }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Item</AlertDialogTitle>
      </AlertDialogHeader>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
```

## Utility Functions

### Class Name Merging (`src/lib/utils.ts`)

```typescript
import { cn } from "@/lib/utils";

// Merge Tailwind classes conditionally
<div className={cn(
  "base-class",
  condition && "conditional-class",
  anotherCondition ? "class-a" : "class-b"
)} />
```

## Animation Patterns

Uses Framer Motion for animations.

```typescript
import { motion } from "framer-motion";

// Fade in with slide up
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  Content
</motion.div>

// Staggered children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```
