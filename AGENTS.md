# AGENTS.md

Next.js 15 (App Router) + React 19 + TypeScript with serverless API (Vercel functions). Not a monorepo.

## Commands

| Command           | What it does                            |
|-------------------|-----------------------------------------|
| `bun install`     | Install deps. **Bun only** — `bun.lock`; no npm/yarn/pnpm lockfiles. |
| `bun run dev`     | Next.js dev server with HMR.            |
| `bun run build`   | `next build` (typecheck + build).       |
| `bun run lint`    | `oxlint`.                               |
| `bun run preview` | Local preview of the production build.  |
| `bun run bootstrap` | Run DB migration + seed (local only). |

- Typecheck runs as part of `next build`. Verification: `bun run lint && bun run build`.
- `bun run lint` exits 0 with benign `react(only-export-components)` warnings in shadcn components — not a failure.
- **No test framework** (no `test` script). Do not run tests.

## Toolchain & build wiring

- Lint config `.oxlintrc.json` (plugins: react, typescript, oxc). No style/format rules.
- React Compiler enabled via `next.config.ts` (`experimental.reactCompiler: true`).
- Tailwind CSS 4 via `@tailwindcss/postcss` + `postcss.config.mjs`.
- `@` → `app` path alias configured in `tsconfig.json`.
- `README.md` is the untouched Next.js template boilerplate — not project documentation.

## App structure

**Pusat Data dan Informasi Program Studi Sains Data** — accreditation portal for Sains Data study program at Universitas Saintek Muhammadiyah.

React frontend (`app/`, `components/`) + serverless API (`app/api/`, Neon Postgres).
Entry: `app/layout.tsx` → `app/template.tsx` (Providers) → route groups:

### Route groups (App Router)

| Group         | Layout                          | Routes                              | Access      |
|---------------|---------------------------------|-------------------------------------|-------------|
| `(public)`    | Navbar + Footer                 | `/`, `/profile`, `/spmi`, `/akreditasi`, `/contact`, `/data-dokumen` | Public      |
| `(auth)`      | No navbar/footer                | `/login`, `/daftar`                 | Guest       |
| `(protected)` | DashboardSidebar + Providers    | `/dashboard/*`                      | Auth (admin/sudo) |

### Public routes (all static/dynamic)

| Route            | Page                      | Notes                                      |
|------------------|---------------------------|--------------------------------------------|
| `/`              | `app/(public)/page.tsx`   | Hero, stats, overview cards                |
| `/profile`       | `app/(public)/profile/page.tsx` | Tentang, visi-misi, prodi table, struktur org |
| `/spmi`          | `app/(public)/spmi/page.tsx`    | Tree sidebar, `?kategori=` selects category |
| `/akreditasi`    | `app/(public)/akreditasi/page.tsx` | LAM INFOKOM instrument table (public read) |
| `/data-dokumen`  | `app/(public)/data-dokumen/page.tsx` | Searchable docs (Berlaku only)             |
| `/contact`       | `app/(public)/contact/page.tsx`    | Real address/channels, Google Maps iframe  |

### Auth routes

| Route      | Page                      | Notes                                      |
|------------|---------------------------|--------------------------------------------|
| `/login`   | `app/(auth)/login/page.tsx`   | Email/password login → `/dashboard`        |
| `/daftar`  | `app/(auth)/daftar/page.tsx`  | Register (username, email, password) → `/dashboard` |

### Protected routes (require admin/sudo role)

| Route                          | Page                                    | Notes                                      |
|--------------------------------|-----------------------------------------|--------------------------------------------|
| `/dashboard`                   | `app/(protected)/dashboard/page.tsx`    | Overview stats (6 cards)                   |
| `/dashboard/instrumen`         | `app/(protected)/dashboard/instrumen/page.tsx` | InstrumenTable (admin mode, full CRUD)    |
| `/dashboard/dokumen`           | `app/(protected)/dashboard/dokumen/page.tsx` | DataDokumenAdmin (all statuses)           |
| `/dashboard/users`             | `app/(protected)/dashboard/users/page.tsx`   | UsersTab (SUDO only)                      |
| `/dashboard/audit-log`         | `app/(protected)/dashboard/audit-log/page.tsx` | AuditLogTab (SUDO only)                  |
| `/dashboard/settings`          | `app/(protected)/dashboard/settings/page.tsx`  | Placeholder (SUDO only)                   |

## Backend & auth (Neon Postgres) — Serverless (Vercel)

- **Single shared handler.** All route logic in `app/lib/api-handler.ts` (`handleApi(req, path)` + helpers `json`/`readJson`/`bearerToken`/`adminFromToken`/`requireRole`/`logAudit`/`deleteStoredFile`, module `pool`, constants `UPLOAD_ALLOWED`/`UPLOAD_MAX_BYTES`). Runs on Vercel's Node runtime (cross-runtime compatible). Passwords: `bcryptjs`.

- **Vercel API routes** (`app/api/`): per-route `route.ts` files delegating to `handleApi`:
  - `auth/login` (POST), `auth/logout` (POST), `auth/me` (GET), `auth/register` (POST)
  - `stats` (GET, protected)
  - `instrumen` (GET, public), `instrumen/children` (POST/PUT/DELETE, auth), `instrumen/upload` (POST, auth → Vercel Blob)
  - `users` (GET/POST, SUDO/Admin), `users/[id]` (GET/PUT/DELETE, SUDO)
  - `audit-log` (GET, SUDO)

- `vercel.json`: `buildCommand: "bun run build"`, `installCommand: "bun install"`, `framework: "nextjs"`, `outputDirectory: ".next"`, SPA fallback rewrite.

- **DB**: Neon Postgres. `.env` (gitignored): `DATABASE_URL` (pooled), `DATABASE_URL_NON_POOLING` (+ optional `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`). Non-pooling for DDL via `server/bootstrap.ts`; pooled for app queries. DDL provisioned via `bun run bootstrap` (local/Neon).

- `server/schema.sql`: `admins` (email, username, password_hash, role: `sudo`/`admin`/`user`, `is_active`, max 3 admin accounts via trigger), `sessions`, `audit_log`, `instrumen_sections`, `instrumen_rows` (`penjelasan_prodi`), `instrumen_children` (`doc` JSONB + `file_name`/`file_url`). Bootstrap seeds sudo admin, upserts sections/rows from `app/data/instrumen.ts`, deletes placeholder children.

## Conventions & branding

- Import styles: shadcn files use double quotes; hand-written app code uses single quotes (`@/...`).
- Styling: Tailwind utilities + token layer in `app/globals.css` (imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, `@fontsource-variable/plus-jakarta-sans`). Blue/white/gray palette, `--primary` blue (oklch ~0.5 0.2 250), Plus Jakarta Sans.
- Institution content is real (Universitas Saintek Muhammadiyah / SaintekMu). Branding: "Sains Data", Fakultas Ilmu Komputer; favicon "SD" (`public/favicon.svg`); `lang="id"`. Portal: **Pusat Data dan Informasi Program Studi Sains Data**.

## Scope notes

- Parent directory's `../AGENTS.md` documents sibling projects — ignore it.