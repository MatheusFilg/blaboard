# Beroboard - AI Agent & Developer Guide

This document serves as the primary context source for AI agents and developers working on the **Beroboard** project. It outlines the architectural patterns, technology stack, and specifically the authentication implementation details.

## 🏗 Project Architecture

This is a Monorepo managed by **Turborepo** and **Bun**.

### Workspace Structure
- **apps/**
  - `web`: Frontend application (Next.js 15, React 19, Tailwind, Shadcn/UI). Runs on **port 3001**.
  - `server`: Backend API (ElysiaJS). Runs on **port 3000**.
- **packages/**
  - `auth`: Centralized Better Auth configuration and logic.
  - `db`: Prisma ORM setup and MongoDB connection.
  - `env`: Type-safe environment variable validation (T3 Env).
  - `config`: Shared TypeScript and configuration files.

## 🔐 Authentication (Better Auth) Implementation

The project uses **Better Auth** for authentication, integrated deeply into the monorepo structure.

### 1. Configuration (`packages/auth`)
- **Location:** `packages/auth/src/index.ts`
- **Strategies:**
  - **Social Only:** Google and GitHub are enabled.
  - **Email/Password:** Explicitly **DISABLED**.
- **Database Adapter:** Prisma Adapter (MongoDB).
- **Session Management:** Database-backed sessions.

### 2. Role Management
- **Default Role:** `ADMIN`.
- **Implementation:** The default role is injected at the application level via `user.additionalFields` in the Better Auth config, not as a database default.
- **Schema:** The `User` model in Prisma has a `role` field.

### 3. Cross-Origin & Environment Handling
Since the Web App (3001) and API (3000) run on different ports, specific configurations are in place:
- **CORS:** The server allows `env.CORS_ORIGIN` (http://localhost:3001).
- **Cookies:**
  - **Production:** `SameSite: "none"`, `Secure: true`.
  - **Development:** `SameSite: "lax"`, `Secure: false`.
  - *Reasoning:* Prevents `state_mismatch` errors during local development where HTTPS is not used.
- **Base URL:** The server uses `env.BETTER_AUTH_URL` (http://localhost:3000).

### 4. Frontend Integration (`apps/web`)
- **Client:** `apps/web/src/lib/auth-client.ts` creates the client pointing to `NEXT_PUBLIC_SERVER_URL`.
- **Login Flow:**
  - Uses `authClient.signIn.social`.
  - **Callback URL:** Must be absolute to ensure redirection to the frontend.
  - Pattern: `callbackURL: 
${window.location.origin}/dashboard
`.

### 5. Backend Integration (`apps/server`)
- **Plugin:** `apps/server/src/plugins/auth.plugin.ts` exposes the Better Auth handler at `/api/auth/*`.
- **Middleware:** `apps/server/src/middleware/auth.middleware.ts` provides a derivation to inject `user` and `session` into the Elysia context.

## 🗄 Database (MongoDB & Prisma)

- **Type:** MongoDB.
- **Deployment Requirement:** **Replica Set** (`rs0`).
  - *Why?* Better Auth and Prisma require transactions, which are only supported in MongoDB Replica Sets.
- **Docker Setup:**
  - Located in `packages/db/docker-compose.yml`.
  - Includes a healthcheck that automatically initializes the Replica Set (`rs.initiate()`)
  - Uses a **KeyFile** (`packages/db/mongo-key/replica.key`) for internal authentication between nodes.

### Common Commands
- **Generate Client:** `bun run db:generate`
- **Push Schema:** `bun run db:push` (Preferred over migrations for MongoDB in dev).

## 💻 Development Patterns

- **Package Manager:** Bun (v1.3+).
- **Linting/Formatting:** Biome (`biome.json`).
- **Typing:** Strict TypeScript.
- **Environment Variables:**
  - Managed via `@beroboard/env`.
  - **Web:** `.env` (needs `NEXT_PUBLIC_SERVER_URL`).
  - **Server:** `.env` (needs `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_*`, `GITHUB_*`).

## 🚀 How to Run

1. **Start Database:**
   ```bash
   docker compose -f packages/db/docker-compose.yml up -d
   ```
2. **Setup Env:** Ensure `.env` files are created in `apps/server` and `apps/web`.
3. **Start Dev Server:**
   ```bash
   bun run dev
   ```
   - Access Web: http://localhost:3001
   - Access API: http://localhost:3000
