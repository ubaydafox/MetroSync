# MetroSync — Project Work II (CSE - 06133230)

Metropolitan University Bangladesh
Department of Computer Science and Engineering — Spring 2025

## Group & Contact

- Project Title: MetroSync
- Group Members:
  - 0562310005101027 — Ahsan Habib Nayef
  - 0562310005101030 — Shorifur Rashid
  - 0562310005101042 — Md. Lal Chan

## Project Summary

MetroSync is a web-based academic collaboration and scheduling platform built with Next.js and TypeScript. It aims to simplify course management, notices, schedules, and task tracking for students, class representatives (CR), teachers, heads of department (HOD), and admins.

Key goals:

- Role-based access to dashboards and actions
- Schedule and task management for students and teachers
- Department-level controls for HOD and exportable reports for admins

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind / PostCSS (project contains `postcss.config.mjs`)
- pnpm / npm for package management

## User Roles (brief)

- Unregistered User: browse public pages (landing, about, contact)
- Student: view personal schedules, courses, notices, tasks; update profile
- CR: manage batch, post notices, add students to courses
- Teacher: manage course materials, post notices, add students
- HOD: manage courses/teachers/schedules and assign teachers
- Admin: manage HOD accounts and system-wide settings

## Roadmap — User Story Planning (high level)

Each entry is listed with owner and deadline.

- N-1: Authentication (registration, login, password reset) — Nayef — 31/08/2025
- A-1: Student dashboard (schedules, tasks, notices) — Abdullah — 31/08/2025
- S-1: Public pages (landing, about, contact) — Shahriya — 31/08/2025
- N-2: Teacher dashboard — Nayef — 07/09/2025
- A-2: Profile page with update — Abdullah — 07/09/2025
- S-2: FAQ / Terms / Privacy — Shahriya — 07/09/2025
- N-3: HOD dashboard — Nayef — 05/10/2025
- A-3: Notice board types — Abdullah — 05/10/2025
- S-3: Password change (logged-in users) — Shahriya — 05/10/2025
- N-4: Admin dashboard — Nayef — 26/10/2025
- A-4: Student task timeline — Abdullah — 26/10/2025
- S-4: Logout/session invalidation — Shahriya — 26/10/2025
- N-5: CSV export for schedules/reports — Nayef — 02/11/2025
- A-5: Student dashboard (continued) — Abdullah — 02/11/2025
- S-5: Basic notification system — Shahriya — 02/11/2025
- N-6: Auth middleware & role-based protection — Nayef — 09/11/2025
- A-6: Schedule viewer (list/calendar) — Abdullah — 09/11/2025
- S-6: Basic search (courses/teachers/notices) — Shahriya — 09/11/2025

## Product Backlog & Acceptance Criteria (summary)

- N-1: Auth — Valid credentials login; invalid denied; password reset forces change; resistant to SQL injection
- A-1 / A-5: Student dashboard — loads correct data, no data leakage, UI sync with backend
- S-1 / S-2: Public content — accessible without login, navigation functional, responsive
- N-2 / N-3 / N-4: Dashboards (Teacher/HOD/Admin) — CRUD, assignments persist, role-based access enforced
- A-3: Notice systems — pagination, pinned notices, department filtering
- S-3 / S-4: Password/Logout — validation, token/session invalidation, post-logout access denied
- N-5: Export — CSV format valid and handles large datasets
- N-6: Middleware — protected routes accessible to authorized roles only; session expiry enforced

## Development — Run locally

Prerequisites: Node.js (16+), pnpm or npm.

Install dependencies:

```bash
pnpm install
# or
npm install
```

Run development server:

```bash
pnpm dev
# or
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

Notes:

- Environment variables (API base URL, auth secrets) should be placed in a `.env.local` at the project root. Do not commit secrets.

## Project structure (high level)

- `app/` — Next.js App Router pages and layouts
- `app/(main)/about`, `contact`, `credits` — example static pages/components
- `components/` — reusable UI components (Button, Navbar, Logo)
- `utils/` — small helpers (e.g., `cn.ts`)
- `public/` — static assets
- `sql/` — database schema and migration artifacts

## Contribution & Workflow

- Use feature branches per user story (e.g., `feature/N-1-auth`).
- Create PRs against `main` and include a short description and related story ID.
- Keep changes small and add tests for new backend behavior where applicable.

## Acceptance & QA checklist (for a story)

1. Implement feature branch and tests
2. Manual smoke test: basic flows (login, role access, UI rendering)
3. Run linter/typecheck and unit tests
4. Create PR and request review

## Next steps / TODO (project-maintainer)

- Implement backend endpoints (auth, schedules, notices) and secure them
- Add automated tests for critical flows (auth, role-based access)
- Implement CSV export and notification persistence

## License

This repository contains course project material. Add a license file or consult course policy before publishing.

---

## Requirements coverage (this README change)

- Create summarized README with academic header & team — Done
- Include user roles and short descriptions — Done
- Summarize user story planning with owners and deadlines — Done
- Summarize product backlog with acceptance tests — Done
- Provide setup/run instructions for local development — Done

If you'd like, I can also:

- Add a CONTRIBUTING.md, PR template, or a minimal `.env.example`
- Generate a simple checklist issue template for each user story
