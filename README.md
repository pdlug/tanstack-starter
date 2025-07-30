# TanStack Starter

A modern full-stack application built with TanStack Start, featuring authentication, database integration, and deployment to Cloudflare Workers.

## Features

- **TanStack Start** - File-based routing with TanStack Router
- **Better Auth** - Modern authentication solution
- **Drizzle ORM** - Type-safe database queries
- **Cloudflare D1** - Serverless SQLite database
- **TanStack Form** - Type-safe form handling
- **Tailwind CSS v4** - for styling with only a bare bones layout included, add your own component system or be yet another app that uses [shadcn/ui](https://ui.shadcn.com/)
- **TypeScript** - Full type safety

## Design

Server functions - why have a separate API layer only your app is going to use it?

## Prerequisites

- **Node.js** 18+
- **pnpm** (recommended package manager)
- **Cloudflare account** (for deployment)

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd tanstack-starter
pnpm install
```

### 2. Create D1 Databases

You'll need separate databases for development and production.

#### Local Development Database

```bash
# Create local D1 database for development
npx wrangler d1 create tanstack-starter-dev

# This will output database info including the database_id
# Copy the database_id to your wrangler.jsonc
```

#### Production Database

```bash
# Create production D1 database
npx wrangler d1 create tanstack-starter-prod

# Copy this database_id for production deployment
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Better Auth secret (generate a secure random string)
BETTER_AUTH_SECRET="your-super-secret-auth-key-here"
```

> **Note**: Generate a secure `BETTER_AUTH_SECRET` using: `openssl rand -base64 32`

### 4. Update Wrangler Configuration

Update the `database_id` in `wrangler.jsonc` with your development database ID:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "tanstack-starter-dev",
      "database_id": "your-dev-database-id-here",
      "migrations_dir": "./drizzle",
    },
  ],
}
```

### 5. Run Database Migrations

#### For Local Development

```bash
# Generate migration files (if schema changes)
pnpm run db:generate

# Apply migrations to local D1 database
npx wrangler d1 migrations apply tanstack-starter-dev --local
```

#### For Production (before deploying)

```bash
# Apply migrations to production D1 database
npx wrangler d1 migrations apply tanstack-starter-prod
```

## Development

### Start Development Server

```bash
pnpm run dev
```

This starts the Vite development server at `http://localhost:3000`.

### Database Operations

```bash
# Generate new migration after schema changes
pnpm run db:generate

# Apply migrations locally
npx wrangler d1 migrations apply tanstack-starter-dev --local

# View local database
npx wrangler d1 execute tanstack-starter-dev --local --command "SELECT * FROM users"
```

## Deployment

### 1. Update Production Configuration

For production deployment, update your `wrangler.jsonc` with the production database ID or create separate configuration files.

### 2. Run Production Migrations

**Important**: Always run migrations on production database before deploying new code:

```bash
# Apply any pending migrations to production
npx wrangler d1 migrations apply tanstack-starter-prod
```

### 3. Set Production Environment Variables

```bash
# Set production secrets
npx wrangler secret put BETTER_AUTH_SECRET
```

### 4. Deploy Application

```bash
pnpm run deploy
```

This will:

1. Build the application
2. Deploy to Cloudflare Workers
3. Your app will be available at `https://your-app.your-subdomain.workers.dev`

## Project Structure

```
src/
├── components/        # Reusable UI components
├── db/
│   ├── schema/        # Drizzle database schemas
│   └── db.ts          # Database connection
├── env/               # Environment variable validation
├── lib/
│   └── auth/          # Better Auth configuration
├── routes/            # File-based routes
|── services/          # Business logic
├── styles/            # Global styles
└── utils/             # Utility functions
```

## Available Scripts

```bash
pnpm run dev            # Start development server
pnpm run build          # Build for production
pnpm run deploy         # Build and deploy to Cloudflare
pnpm run preview        # Preview production build locally

# Database
pnpm run db:generate    # Generate migration files
pnpm run db:migrate     # Apply migrations

# Code Quality
pnpm run test           # Run all tests (type checking, linting, formatting)
pnpm run fix            # Auto-fix formatting and linting issues

# Auth
pnpm run auth:generate  # Regenerate auth schema
```

## Database Migrations

When you modify the database schema:

1. **Update schema files** in `src/db/schema/`
2. **Generate migration**: `pnpm run db:generate`
3. **Apply locally**: `npx wrangler d1 migrations apply tanstack-starter-dev --local`
4. **Test your changes** in development
5. **Apply to production**: `npx wrangler d1 migrations apply tanstack-starter-prod`
6. **Deploy**: `pnpm run deploy`

## Troubleshooting

### Deploy Issues

If you encounter deploy configuration errors:

```bash
# Clear wrangler cache
rm -rf .wrangler
pnpm run deploy
```

### Database Connection Issues

- Ensure your D1 database is created and migrations are applied
- Verify the `database_id` in `wrangler.jsonc` matches your database
- Check that environment variables are properly set

### Authentication Issues

- Verify `BETTER_AUTH_SECRET` is set and matches between environments
- Ensure `VITE_BASE_URL` matches your application URL

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
