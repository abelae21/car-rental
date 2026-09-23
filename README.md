# Wheelhouse — Car Rental Platform

Full-stack car rental platform. This repo is being built in phases; **Phase 1 (Foundation + Auth) is complete.**

## Phase 1 — what's included

**Backend (`/server` — NestJS + Prisma + PostgreSQL)**
- Complete normalized Prisma schema: users, vehicles, vehicle_images, bookings, payments, reviews, favorites, notifications, coupons
- Layered architecture: controllers → services → DTOs → guards → filters → interceptors
- JWT auth with **access + refresh tokens** (refresh token stored hashed in DB, delivered via httpOnly cookie)
- Register, Login, Logout, Forgot Password, Reset Password, Email Verification
- RBAC via `@Roles()` decorator + global `RolesGuard` (`CUSTOMER` / `ADMIN`)
- Global exception filter + response envelope interceptor
- Nodemailer-based transactional email service (verification, reset, booking, payment templates ready for later phases)
- Rate limiting (Throttler), Helmet, CORS, class-validator on every DTO

**Frontend (`/client` — React 19 + Vite + TS + Tailwind)**
- Axios instance with **silent refresh-token interceptor** — access token kept in memory only, refresh token in httpOnly cookie
- Auth context wired to the API: register / login / logout / session bootstrap on load
- Zod + React Hook Form validation matching backend password rules exactly
- Protected routes with role-based gating (`<ProtectedRoute allowedRoles={['ADMIN']} />`)
- Pages: Landing, Login, Register, Forgot Password, Reset Password, Verify Email, Dashboard, Admin Dashboard
- TanStack Query + React Hot Toast + Framer Motion wired in, ready for data-fetching phases
- Dark mode support (`class` strategy), accessible focus states, reduced-motion respected

## Getting started

### 1. Database
Create a free [Neon](https://neon.tech) Postgres database (or use local Postgres), copy the connection string.

### 2. Backend
```bash
cd server
cp .env.example .env       # fill in DATABASE_URL, JWT secrets, SMTP creds
npm install
npm run prisma:migrate     # creates tables
npm run prisma:seed        # creates admin@carrental.com / Admin123!
npm run start:dev          # http://localhost:4000/api/v1
```

### 3. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

### 4. Try it
- Register a customer account at `/register`
- Log in as the seeded admin (`admin@carrental.com` / `Admin123!`) and visit `/admin` — the RBAC guard should let you through
- Log in as the customer and try `/admin` — you should be redirected home
- Refresh the page while logged in — the silent-refresh flow should keep you logged in without re-entering credentials

## What's next (Phase 2+)
1. Vehicle management + Cloudinary image upload + search/filter/sort
2. Booking engine (availability checking, overlap prevention, cancellation policy)
3. Payments (invoice generation, transaction history, coupons, refunds)
4. Reviews, favorites, notifications wired to real data
5. Admin analytics dashboard (Recharts: revenue, fleet utilization, booking trends)
6. Visual/UX polish pass: skeletons, empty/error states, full responsive + animation pass

Say the word when you're ready for the next phase and I'll pick up from here.
