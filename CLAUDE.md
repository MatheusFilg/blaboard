# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev              # Start all apps (web + server)
bun run dev:web          # Frontend only (port 3001)
bun run dev:server       # Backend only (port 3000)

# Build & Type Check
bun run build            # Build all workspaces
bun run check-types      # TypeScript check across all

# Code Quality (Biome)
bun run check            # Format & lint
bun run lint             # Alias for check

# Database (MongoDB + Prisma)
bun run db:start         # Start Docker container
bun run db:push          # Push schema to database
bun run db:generate      # Generate Prisma client
bun run db:studio        # Open Prisma Studio UI
bun run db:stop          # Stop container
```

## Architecture

**Monorepo** managed by Turborepo + Bun workspaces.

### Apps
- **`apps/web`** - Next.js 16, React 19, Tailwind v4, shadcn/ui (port 3001)
- **`apps/server`** - ElysiaJS backend API (port 3000)

### Packages
- **`packages/auth`** - Better Auth config (Google + GitHub social login, no email/password)
- **`packages/db`** - Prisma ORM + MongoDB (requires Replica Set for transactions)
- **`packages/env`** - T3 Env type-safe environment variables
- **`packages/config`** - Shared TypeScript configuration

## Tech Stack

- **Runtime:** Bun
- **Frontend:** Next.js 16 + React 19 + React Compiler + Tailwind v4
- **Backend:** ElysiaJS (type-safe HTTP framework)
- **Database:** MongoDB 7 (Replica Set required) + Prisma 7
- **Auth:** Better Auth with database sessions (7-day expiry)
- **UI Components:** shadcn/ui + Base UI + Lucide icons
- **Linting/Formatting:** Biome (tabs, double quotes, Tailwind class sorting)

## UI Components

**Always check for shadcn components first:**
1. If the component exists in `apps/web/src/components/ui/`, use it
2. If it doesn't exist but is available in shadcn, install it: `npx shadcn@latest add <component>`
3. Only create custom components if shadcn doesn't have what you need

## Key Patterns

**Cross-Origin Setup:** Web (3001) and API (3000) use CORS. Cookie settings differ between dev (SameSite: lax) and prod (SameSite: none, Secure: true).

**Auth Flow:** Social providers only. Callback URLs must be absolute: `${window.location.origin}/dashboard`

**Prisma Schema:** Split across `packages/db/prisma/schema/` (schema.prisma, auth.prisma, org.prisma). Always run `db:generate` after schema changes.

**Biome Config:** Uses `cn`, `clsx`, `cva` for Tailwind class sorting. Format with tabs, double quotes.
