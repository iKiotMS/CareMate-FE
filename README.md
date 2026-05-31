# 🧹 Cleaning Service Platform - Frontend

House Cleaning Service Platform web application built with **Next.js 14**, **React**, **Tailwind CSS**, and **TanStack Query**.

## 📋 Project Structure

```
app/
├── layout.tsx                 # Root layout with QueryClientProvider
├── page.tsx                   # Home page
├── globals.css               # Global Tailwind styles
├── (auth)/                   # Public auth routes
│   ├── layout.tsx           # Auth layout wrapper
│   ├── login/page.tsx       # Login page
│   └── register/page.tsx    # Register page
├── (customer)/              # Customer routes (protected)
│   ├── layout.tsx
│   ├── dashboard/page.tsx   # Customer dashboard
│   ├── orders/
│   │   ├── page.tsx         # Orders list
│   │   ├── new/page.tsx     # Create order
│   │   └── [id]/page.tsx    # Order detail
│   └── profile/page.tsx
├── (cleaner)/               # Cleaner routes (protected)
│   ├── layout.tsx
│   ├── dashboard/page.tsx   # Cleaner dashboard
│   ├── jobs/
│   │   ├── page.tsx         # Assigned jobs
│   │   └── [id]/page.tsx    # Job detail & execution
│   ├── work-history/page.tsx
│   └── profile/page.tsx
└── (admin)/                 # Admin routes (protected)
    ├── layout.tsx
    ├── dashboard/page.tsx   # Admin dashboard
    ├── orders/page.tsx      # All orders management
    ├── customers/page.tsx   # Customer management
    ├── cleaners/page.tsx    # Cleaner management
    └── tasks/page.tsx       # Task catalog management

components/                   # Reusable React components
├── Button.tsx
├── Form.tsx
└── ...

hooks/                        # Custom React hooks
├── useAuth.ts              # Auth state management (Zustand)
├── useApi.ts               # React Query hooks for API calls
└── ...

services/                     # API and utility services
├── api-client.ts           # Axios instance with JWT handling
├── query-client.ts         # TanStack Query configuration
└── ...

types/                        # TypeScript type definitions
└── index.ts

utils/                        # Utility functions
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Key variables:

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)
- `NEXT_PUBLIC_APP_URL`: Frontend application URL

### Running the Application

**Development mode:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Production build:**

```bash
npm run build
npm run start
```

## 🛣️ Route Structure

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Customer registration
- `/forgot-password` - Password reset request

### Customer Routes

Protected with `@Roles('customer')`:

- `/customer/dashboard` - Customer dashboard
- `/customer/orders` - List customer's orders
- `/customer/orders/new` - Create new cleaning order
- `/customer/orders/:id` - View order detail
- `/customer/profile` - Customer profile management

### Cleaner Routes

Protected with `@Roles('cleaner')`:

- `/cleaner/dashboard` - Cleaner dashboard
- `/cleaner/jobs` - List assigned jobs
- `/cleaner/jobs/:id` - View and execute job
- `/cleaner/work-history` - Completed orders
- `/cleaner/profile` - Cleaner profile management

### Admin Routes

Protected with `@Roles('admin')`:

- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/orders` - View all orders, assign cleaners
- `/admin/customers` - Customer management
- `/admin/cleaners` - Cleaner management
- `/admin/tasks` - Task catalog management

## 🔑 Authentication

### Token Management

- Access token stored in HTTP-only cookie (handled by backend)
- Refresh token managed via `js-cookie`
- Automatic token refresh on 401 response
- Auto-logout on refresh failure

### Auth Store (Zustand)

```typescript
import { useAuthStore } from "@/hooks/useAuth";

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## 📊 Data Fetching

### React Query Hooks

Common hooks for API calls:

```typescript
import {
  useAuth,
  useUser,
  useOrders,
  useOrder,
  useTaskCatalog,
} from "@/hooks/useApi";

// Login
const { login, isLoading } = useAuth();

// Get current user
const { data: user } = useUser();

// Get orders list
const { data: orders, isLoading } = useOrders({ status: "PENDING" });

// Get single order
const { data: order } = useOrder(orderId);

// Get available tasks
const { data: tasks } = useTaskCatalog();
```

### Mutation Pattern

```typescript
const { mutateAsync, isPending } = useMutation({
  mutationFn: (data) => apiClient.post("/endpoint", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["key"] });
  },
});
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Class Variance Authority** for component variants (optional)
- **Lucide React** for icons
- Custom color scheme configured in `tailwind.config.js`

### Theme Colors

- `primary` - Blue (#3b82f6)
- `secondary` - Green (#10b981)
- `danger` - Red (#ef4444)
- `warning` - Amber (#f59e0b)

## 📝 Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

## 🧠 Key Features

### Authentication Flow

1. User registers/logs in on `/login` or `/register`
2. Tokens stored in cookies/storage
3. Automatic redirection to role-specific dashboard
4. Protected routes use `JwtAuthGuard` + `RolesGuard`

### Order Management

**Customer:**

- Create order with tasks, date, time, address
- Upload before-photos
- Track order status
- Submit review after completion

**Cleaner:**

- View assigned orders
- Accept jobs
- Check-in and upload before-photos
- Mark tasks as done
- Upload after-photos
- Complete job

**Admin:**

- View all orders
- Assign/reassign cleaners
- Cancel orders
- Monitor completion
- View photos and reviews

### File Upload

- Images uploaded to Cloudinary
- Multiple file support
- Preview before upload
- Validation on client and server

## 🚦 State Management

### Zustand Stores

- `useAuthStore` - Authentication state (user, tokens)
- Additional stores can be added as needed

### React Query

- Centralized server state
- Automatic caching and synchronization
- Mutation triggers query invalidation

## 📄 License

MIT
