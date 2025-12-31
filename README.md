# 🚀 Algonauts — Competitive Programming Club Platform

Algonauts is a **full-stack competitive programming club platform** built for **internal college use (20–25 users)**, with a clean architecture designed to scale to **public use later**.

The project is **feature-complete for v1** and focuses on correctness, extensibility, and simplicity over flashy features.

---

## ✨ Features Overview

### 🔐 Authentication & Roles
- JWT-based authentication
- Role-based access control (RBAC)
- Roles:
  - **ADMIN** — full control
  - **MENTOR** — read-only admin access
  - **MEMBER** — participant access

JWT payload contains **only**:
```
{
  "userId": "uuid",
  "role": "ADMIN | MENTOR | MEMBER"
}
```
## 📘 Practice Tracker
- Automatic Codeforces sync  
- Idempotent sync (no duplicate problems)  
- Difficulty-based stats:
  - **EASY**
  - **MEDIUM**
  - **HARD**
- Practice leaderboard (**MENTOR / ADMIN only**)

---

## 🏁 Contest System
- Individual and Team contests  
- Manual problem links (CF / LC / any URL)  
- Contest statuses:
  - **UPCOMING**
  - **RUNNING**
  - **FINISHED**
- User-declared submissions (no judging yet)  
- Unified leaderboard:
  - User leaderboard for individual contests
  - Team leaderboard for team contests

---

## 👥 Team Contests (Admin-managed)
- Admin creates teams  
- Admin assigns members  
- One team per user per contest  
- Backend-enforced constraints  

---

## 🛠 Admin Panel
- Create contests  
- Add problems  
- Create teams  
- Assign team members  
- Mentor has **read-only** admin access  

---

## 🧱 Tech Stack

### Backend
- Node.js  
- Express  
- PostgreSQL  
- Prisma ORM v7 (`@prisma/adapter-pg`)  
- JWT authentication  
- REST API  

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Axios  
- Zod + React Hook Form  
- JWT stored in `localStorage`  

---

## 🌐 Backend API (Final & Locked)

### Base URL
```http://localhost:5001```


---

## 🔑 Auth Routes

### POST /api/auth/login
Request body:
- email: string  
- password: string  

Response (login & signup):
- token: JWT_TOKEN  
- user:
  - id: uuid  
  - name: string  
  - email: string  
  - role: ADMIN | MENTOR | MEMBER  

---

## 📘 Practice Routes

### User
- POST /api/practice/sync/codeforces  
- GET /api/practice/me  
- GET /api/practice/me/stats  

Stats response:
- total: number  
- breakdown:
  - EASY: number  
  - MEDIUM: number  
  - HARD: number  

### Mentor / Admin
- GET /api/practice/leaderboard  

---

## 🏁 Contest Routes

### All users
- GET /api/contests  
- GET /api/contests/:contestId  
- POST /api/contests/:contestId/submit  
- GET /api/contests/:contestId/leaderboard  

Submission and leaderboard logic is **unified**.  
Backend automatically decides whether the contest is **user-based or team-based**.

### Admin only
- POST /api/contests  
- POST /api/contests/:contestId/problems  

---

## 👥 Team Routes (Admin only)
- POST /api/contests/:contestId/teams  
- POST /api/contests/teams/:teamId/members  

---

## 🖥 Frontend Architecture

src/  
├── app/  
│   ├── (auth)/login | signup  
│   ├── (protected)/  
│   │   ├── dashboard  
│   │   ├── contests  
│   │   ├── contests/[contestId]  
│   │   └── admin  
│   ├── layout.tsx  
│   └── page.tsx  
│  
├── components/  
│   ├── ui/  
│   ├── dashboard/  
│   ├── contests/  
│   ├── admin/  
│   └── common/  
│  
├── context/AuthContext.tsx  
├── lib/api.ts  
├── lib/auth.ts  
├── lib/platforms.ts  
├── types/  
└── app/globals.css  

---

## 🔁 Practice Sync UX (Important)

- User clicks **Sync Codeforces**
- Frontend calls POST /practice/sync/codeforces
- If backend responds **“handle not found”**:
  - Frontend shows a **generic platform handle modal**
  - User enters handle
  - Frontend saves handle via a **platform-agnostic endpoint**
  - Sync automatically retries

This design is future-proof for:
- Codeforces  
- LeetCode  
- CodeChef  
- Other platforms  

---

## ⚙️ Environment Setup

### Frontend (.env.local)
- NEXT_PUBLIC_API_BASE_URL = http://localhost:5001  

### Backend (.env)
- DATABASE_URL = postgresql://...  
- JWT_SECRET = your_secret  

---

## ▶️ Running Locally

### Backend
- npm install  
- npx prisma migrate dev  
- npm run dev  

### Frontend
- npm install  
- npm run dev  

---

## 🚀 Deployment (Planned)

- Frontend: Vercel  
- Backend: Render / Railway  
- Database: Managed PostgreSQL  
- Prisma migrations run on deploy  
- HTTPS + CORS configured for production  

A detailed deployment guide will be added during final polishing.

---

## 🎯 Current Status

- ✅ Backend complete  
- ✅ Frontend core complete  
- ✅ Auth, practice, contests, admin panel implemented  

### 🔧 Final polishing in progress
- Navbar & logout  
- Loading / empty states  
- Team management UI polish  
- Deployment hardening  

---

## 🧠 Design Principles

- Backend is the **source of truth**
- Frontend is a **thin adapter**
- No over-engineering
- Clean abstractions
- Easy to extend  

---

## 📌 License / Usage

Internal college project — educational use.  
Designed to be safely extensible for public deployment later.

---

**Algonauts — Build. Solve. Compete.**



