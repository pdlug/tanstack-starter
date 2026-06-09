---
alwaysApply: true
---

# Philosophy

- Follow requirements carefully and to the letter
- Think step-by-step, describe your plan, then implement
- Fully implement all functionality - no TODOs, placeholders, or missing pieces
- Prioritize readability and maintainability over performance optimization
- If uncertain, say so rather than guessing

# Tech Stack

- **TanStack Start** (1.x) - File-based routing with TanStack Router
  - Docs: https://tanstack.com/start/latest/docs/framework/react/overview
  - Note: APIs evolve quickly across minor versions - refer to current docs
- **Zod** - Data validation and schema-first TypeScript types
- **Drizzle ORM** - Database modeling with Cloudflare D1 (SQLite)
- **Cloudflare Workers** - Deployment target
- **TanStack Form v1** - Form handling with `createFormHook`
- **Better Auth** - Authentication
- **Tailwind CSS v4** - Styling

# Core Principles

- **TypeScript strict mode** with readonly types by default
- **Functional programming** over classes
- **Immutable data** patterns
- **Explicit error handling** with Result/Either patterns
- **Single responsibility** - one concern per file/function

# Type Safety

- MUST avoid `any` - use strict types
- SHOULD use `as const` for literal types
- SHOULD prefer type predicates over type assertions
- SHOULD use discriminated unions for state
- SHOULD use `satisfies` operator for type-safe object literals
- SHOULD use `NoInfer<T>` to prevent unwanted inference
- MUST export types from their defining modules
- MUST use `type` imports for type-only imports

# Code Style

## Formatting

- MUST use `function` keyword for pure functions (not arrow functions at top level)
- MUST use braces around switch case statements
- SHOULD avoid unnecessary braces in conditionals for simple statements
- MUST use descriptive names that reveal intent

## TypeScript Patterns

- SHOULD avoid `let` unless it adds substantial clarity
- MUST use nullish coalescing (`??`) over logical or (`||`) when appropriate
- MUST avoid `null` - always prefer `undefined`
- MUST use `Readonly<{...}>` type syntax over marking individual members readonly
- SHOULD avoid mutation unless absolutely necessary
- SHOULD use `structuredClone()` for deep copying
- SHOULD prefer spreading over `Object.assign`

## Array Operations

- MUST NOT pass function references directly to array methods

  ```typescript
  // ❌ Avoid - harder to debug, less explicit about arguments
  array.map(transform);

  // ✅ Prefer - explicit arguments, easier debugging, better type inference
  array.map((element) => transform(element));
  ```

  _Rationale: Enforced by eslint-plugin-unicorn. Improves readability, debugging (can add breakpoints/logging), and TypeScript type inference._

## Naming Conventions

- **PascalCase** - Types, interfaces, classes, React component files
- **camelCase** - Functions, variables, properties, non-component files
- **SCREAMING_SNAKE_CASE** - Constants
- **kebab-case** - Non-component filenames

## Import Organization

```typescript
// 1. External dependencies
import { useForm } from "@tanstack/react-form";
import { type PropsWithChildren } from "react";

// 2. Internal modules with @/ alias
import { cn } from "@/lib/utils/tailwind";
import { type User } from "@/types/user";

// 3. Relative imports
import { Button } from "./Button";
```

# Error Handling

- MUST throw errors at framework boundaries: server functions, loaders, error boundaries
- MUST use Result/Either for internal logic: services, database operations, utilities
- MUST convert Results to thrown errors at boundaries
- SHOULD use specific error types extending `AppError`
- SHOULD include cause chain for debugging
- MUST NOT use Result/Either in React components

`Result`, `safe`, and `unwrap` live in `src/lib/result.ts`.

```typescript
import { safe, unwrap, type Result } from "@/lib/result";

// Internal service - wrap fallible work with `safe`
export function createPost(db: DB, data: NewPost): Promise<Result<Post, DatabaseError>> {
  return safe(
    async () => {
      const [post] = await db.insert(posts).values(data).returning();
      if (!post) throw new Error("insert returned no rows");
      return post;
    },
    (cause) => new DatabaseError("Failed to create post", { cause }),
  );
}

// Server function - `unwrap` rethrows the error at the framework boundary
export const createPostAction = createServerFn({ method: "POST" }).handler(async ({ data }) => unwrap(await createPost(db, data)));
```

# Project Structure

```
src/
├── components/     # React components
├── routes/         # TanStack Router file-based routes
├── services/       # Business logic and external integrations
├── lib/           # Utilities and helpers
└── types/         # Shared types (prefer co-locating types with implementation)
```

## File Organization

- MUST group related files using barrel exports (`index.ts`)
- MUST prefer named exports over default exports
- MUST keep one concern per file
- SHOULD co-locate types with implementation
- SHOULD only use `src/types/` for truly shared types

# Routing

File-based routing with route groups:

**Named groups** (shared URL prefix):

```
src/routes/dashboard/
├── index.tsx              # /dashboard
└── reports.tsx            # /dashboard/reports
```

**Unnamed groups** (shared layout, no URL prefix):

```
src/routes/_marketing/
├── promos.tsx             # /promos
└── referral.tsx           # /referral
```

**Route definition:**

```typescript
// Loaders call server functions; the DB connection comes from dbMiddleware,
// not a connection string. See src/routes/_authed/home.tsx.
export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
  loader: async () => ({ posts: await getPosts() }),
});

function Dashboard() {
  const { posts } = Route.useLoaderData();
}
```

# Components

- MUST use functional components
- MUST NOT use `React.FC` - use plain functions with named prop types
- MUST export prop types (suffix with `Props`, e.g., `NavigationMenuProps`)
- MUST use named exports
- SHOULD break large components into smaller, single-responsibility components

```typescript
import { type PropsWithChildren } from 'react'

type NavigationListItemProps = Readonly<{
  href: string
  label: string
}>

export function NavigationListItem({ href, label }: NavigationListItemProps) {
  return <a href={href}>{label}</a>
}

// For components with children
type CardProps = Readonly<PropsWithChildren<{
  title: string
}>>

export function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>
}
```

# State & Data Management

## Local State

- SHOULD use `useState` for simple local state
- SHOULD use `useReducer` for complex state logic
- SHOULD avoid prop drilling beyond 3 levels - use context instead

## Server State

- MUST use TanStack Start loaders for initial data loading
- Re-run loaders with `router.invalidate()` after mutations

## Server Functions

MUST use server functions for all backend operations:

```typescript
const FormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const handleSubmit = createServerFn({ method: "POST" })
  .validator(FormSchema)
  .handler(async ({ data }) => {
    // For simple operations, implement inline
    await db.insert(contacts).values(data);
    return { success: true };
  });
```

## Complex Operations

MUST move multi-step operations to `src/services/`:

```typescript
// src/services/registration.ts
export async function onUserRegistered(userId: string, email: string) {
  await Resend.createContact(email);
  await PostHog.track("user.created", { userId, email });
}

// Server function
export const handleRegistered = createServerFn({ method: "POST" })
  .validator(RegisteredSchema)
  .handler(async ({ data }) => {
    await onUserRegistered(data.userId, data.email);
    return { success: true };
  });
```

_Rationale: Keeps server functions clean, enables testing, centralizes complex logic._

# Forms

MUST use TanStack Form with `createFormHook` pattern for consistent styling:

```typescript
// src/components/Form.tsx
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  )
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: {},
  fieldContext,
  formContext,
})
```

**Usage:**

```typescript
import { useAppForm } from "@/components/Form"

const formSchema = z.object({
  email: z.string().email(),
})

export function SignupForm({ onSubmit }: SignupFormProps) {
  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onBlur: formSchema },
    onSubmit: async ({ value }) => await onSubmit(value),
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit() }}>
      <form.AppField name="email">
        {(field) => <field.TextField label="Email" />}
      </form.AppField>
      <button type="submit">Submit</button>
    </form>
  )
}
```

# Authentication

- MUST place authenticated routes under `src/routes/_authed/`
- User object available via `Route.useRouteContext().authSession.user`

```typescript
function Dashboard() {
  const { authSession } = Route.useRouteContext()
  return <div>Welcome {authSession.user.email}</div>
}
```

# Styling

- MUST use Tailwind CSS v4
- SHOULD use shorthand classes (`size-6` not `w-6 h-6`)
- SHOULD avoid absolute values unless no Tailwind equivalent exists
- MUST use `cn()` utility from `lib/utils/tailwind.ts` to compose classes
- SHOULD use class-variance-authority for variant-based components

# Testing

- MUST write tests for services and utilities
- SHOULD write integration tests for critical user flows
- SHOULD test error paths, not just happy paths
- Tests SHOULD provide clear, verbose failure messages

# Accessibility

- MUST use semantic HTML elements
- MUST include ARIA labels for interactive elements
- MUST ensure keyboard navigation works
- SHOULD test with screen readers when possible

# Performance

- SHOULD prefer server-side data fetching
- SHOULD use React.memo sparingly - only for expensive renders
- MUST use Suspense for loading states
- MUST implement error boundaries at route level
- SHOULD show loading skeletons over spinners
