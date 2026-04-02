# ProfileManagementFrontend

React + TypeScript frontend for the Profile Management System.

---

## Tech Stack

- React 19 + TypeScript (Vite)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- TanStack Query — server state
- Zustand — auth state (persisted)
- React Hook Form + Zod — forms and validation
- Axios — HTTP client
- React Router v7

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- Backend API running on `http://localhost:5016`

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/mhrjnrahul/ProfileManagementSystem.git
cd ProfileManagementSystem/ProfileManagementFrontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Run the dev server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

> Make sure the backend is running first — see [Backend Setup](../ProfileManagement.API/README.md).

---

## Project Structure

```
src/
├── api/            — Axios API functions per module
├── components/     — Shared components and layouts
│   ├── layouts/    — DashboardLayout, PublicNavbar, AdminRoute
│   └── ui/         — shadcn/ui components
├── pages/          — Page components organized by feature
├── store/          — Zustand auth store
├── types/          — TypeScript interfaces per module
├── lib/            — Utility functions
├── router.tsx      — Route definitions
└── main.tsx        — App entry point
```

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home — browse all profiles |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/portfolio/:userId` | Public | View a user's portfolio |
| `/dashboard` | Authenticated | Dashboard |
| `/education` | Authenticated | Manage education |
| `/workexperience` | Authenticated | Manage work experience |
| `/skill` | Authenticated | Manage skills |
| `/project` | Authenticated | Manage projects |
| `/sociallink` | Authenticated | Manage social links |
| `/profile/settings` | Authenticated | Edit profile |
| `/portfolio/edit` | Authenticated | Edit full portfolio |
| `/admin` | Admin only | User management |