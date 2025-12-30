# Algonauts Arena – Project Context

## Overview
Algonauts Arena is a competitive programming club platform built for internal college use (20–25 users), with a design goal of being cleanly extensible to public use in the future.

This document serves as shared context for anyone working on the project. It captures architectural decisions, constraints, and current system state so development can continue without repeated rediscovery.

---

## System Status (v1)
- **Backend:** Fully implemented and deployed
- **Frontend:** Fully implemented and deployed
- **Authentication:** JWT-based (access token only)
- **Database:** PostgreSQL with Prisma ORM
- **Target use:** Stable, demo-ready v1

---

## High-Level Architecture
**Browser (Next.js)** ↓ *HTTPS (JWT in Authorization header)* **Backend API (Express)** ↓ *Prisma ORM* **PostgreSQL (Managed)**

---

## Backend Architecture

### Stack
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Design Principles
- Clear separation of concerns
- Prisma access restricted to services
- Stateless REST API
- No server-side sessions

### Layered Structure
`Routes` → `Controllers` → `Services` → `Prisma Client`

---

## Authentication Model

### JWT
- Issued by backend on login/signup
- Stored in frontend `localStorage`
- Sent via `Authorization` header

### JWT Payload
```json```
{
  "userId": "uuid",
  "role": "ADMIN | MENTOR | MEMBER"
}

### JWT Details
* **Payload intentionally minimal**
* No refresh tokens in v1
* No cookies

### Roles & Authorization
* **ADMIN:** Full system access
* **MENTOR:** Contest oversight and leaderboard access
* **MEMBER:** Practice and contest participation
* *All authorization is enforced server-side.*

---

## Database & Prisma
* PostgreSQL with managed hosting
* UUID primary keys
* Prisma migrations as source of truth
* Production database baselined and migration-safe

### Prisma Rules
* **Development:** `prisma migrate dev`
* **Production:** `prisma migrate deploy`
* **Note:** `prisma db push` is not used after baseline.

---

## Deployment Overview
* **Backend:** Render
* **Frontend:** Vercel
* **Database:** Managed PostgreSQL
* **Security:** HTTPS enforced; CORS restricted to frontend origin

---

## Non-Goals (v1)
* No refresh tokens
* No WebSockets
* No NextAuth
* No server actions
* No multi-tenant support
* No public signups beyond intended users

---

## Guiding Principles
* Prefer boring, proven solutions
* Optimize for correctness and clarity
* Avoid premature abstraction
* **Stability over features**