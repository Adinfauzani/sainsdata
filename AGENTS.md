# AGENTS.md

Vite app (React 19 + TypeScript) with a small Bun API server. Not a monorepo —
the parent directory name is misleading; there are no workspace packages. Not
a git repository (no history, no commits).

## Commands

| Command           | What it does                            |
|-------------------|-----------------------------------------|
| `bun install`     | Install deps. **Bun only** — `bun.lock`; no npm/yarn/pnpm lockfiles. |
| `bun run dev`     | Vite dev server with HMR (proxies `/api` + `/uploads` → `:8787`). |
| `bun run server`  | API server (`server/index.ts`) on `:8787` — runs migrate + seed on boot. |
| `bun run start`   | Both: API server (background) + Vite.   |
| `bun run build`   | `tsc -b` (typecheck) **then** `vite build`. |
| `bun run lint`    | `oxlint`.                               |
| `bun run preview` | Local preview of the production build.  |

- `tsc -b` covers three project references: `tsconfig.app.json` (`src`),
  `tsconfig.node.json` (`vite.config.ts`), and `tsconfig.server.json`
  (`server/` **and** `api/` — backend + Vercel functions get typechecked).
  `tsconfig.server.json` uses `moduleResolution: bundler` (extensionless
  imports, like the app), `lib` includes `DOM` (Web `Request`/`File`/
  `crypto`), and `types: ["bun", "node"]` (`@types/bun`).
- Typecheck alone: `bun run tsc -b`. There is no `typecheck` script — do not
  invent `npm run typecheck`. Build order matters: `tsc -b` runs before
  `vite build`, so a passing build already implies types are clean.
- Verification: `bun run lint && bun run build`.
- `bun run lint` exits 0 with a few benign `react(only-export-components)`
  warnings in `src/components/ui/` — not a failure.
- **No test framework** (no `test` script, no test dependency). Do not run
  tests or assume one exists.

## Toolchain & build wiring

- Lint config `.oxlintrc.json` (plugins: react, typescript, oxc). No
  style/format rules (e.g. quotes) are enabled — formatting is not enforced.
- React Compiler is enabled via `reactCompilerPreset()` +
  `@rolldown/plugin-babel` in `vite.config.ts`. Keep that file as the single
  source of truth — do not add a separate babel config.
- Tailwind CSS 4 via `@tailwindcss/vite` in `vite.config.ts` (no
  `tailwind.config.*`, no `postcss.config.*`). `postcss` and `autoprefixer`
  in devDependencies are unused leftovers — do not wire them up.
- `@` → `src` path alias configured in **both** `vite.config.ts` and
  `tsconfig.app.json`.
- `README.md` is the untouched Vite template boilerplate (mentions unused
  template options) — not project documentation.

## TypeScript quirks (easy to miss)

- Project references: `tsconfig.json` → `tsconfig.app.json` (`src`) and
  `tsconfig.node.json` (`vite.config.ts`). Use `tsc -b` (not bare `tsc`).
- `tsconfig.app.json` sets `verbatimModuleSyntax: true` **and**
  `allowImportingTsExtensions: true` (with `moduleResolution: bundler`).
  Therefore:
  - Type-only imports must use `import type` (or the compiler may error).
  - Import extensions are optional: most code uses extensionless
    `@/...` / `./...` imports; only `src/main.tsx` writes `'./App.tsx'`.
    Either style compiles — follow the surrounding file.
- `noUnusedLocals` / `noUnusedParameters` are on — remove unused code.
- `erasableSyntaxOnly: true` — no `const enum`, decorators-with-metadata, etc.

## App structure

Accreditation portal: React frontend (mock data in `src/data/`) + Bun API
server (`server/`, Neon Postgres). Entry: `index.html` → `/src/main.tsx` →
mounts `<App />` inside `BrowserRouter`; `src/App.tsx` owns the `Routes`,
wraps everything in `AuthProvider` + `TooltipProvider`.

Routes (all implemented, plus a `*` catch-all 404 rendered in Indonesian):

| Route      | Page            | Notes                                         |
|------------|-----------------|-----------------------------------------------|
| `/`        | `pages/Home`    | Hero, stats, overview cards                   |
| `/profile` | `pages/Profile` | Tentang, visi-misi, prodi table, struktur org |
| `/spmi`    | `pages/Spmi`    | Tree sidebar, `?kategori=` selects category   |
| `/akreditasi` | `pages/Standar` | LAM INFOKOM instrument table — no tree/dropdown |
| `/contact` | `pages/Contact` | Real address/channels, Google Maps iframe     |
| `/login`   | `pages/Login`   | Admin login card; redirects to `/admin` if authed |
| `/admin`   | `pages/Admin`   | Protected dashboard — redirects to `/login` if not authed |

- Layout: `src/components/layout/` (Navbar, MobileNav, Footer),
  `src/components/PageHeader.tsx` (shared page header used by most pages),
  `src/components/navigation/Tree.tsx`, `src/components/ui/` (shadcn
  primitives), `src/data/` (mock data modules + `treeNodes.ts`),
  `src/types.ts` (shared interfaces — keep data files typed against it; both
  `'../types'` and `'@/types'` imports appear).
- Master-detail page `/spmi` hides its tree behind a `Sheet` on mobile;
  desktop (`lg:`) uses a sticky `<aside>` tree. Selection state lives in the
  URL search param (`useSearchParams`) — do not add a state store for it.
- `/akreditasi` is deliberately a single big table backed by **real data**
  from the root `S1-Prodi-Instrumen-Terakreditasi Prodi Informatika UM
  Banten.xlsx` (source of truth) — `src/data/instrumen.ts` holds the real
  section/row content (No. / Kriteria / Sub Kriteria / Indikator /
  **Penjelasan Prodi**), seeded into Neon and served via `GET /api/instrumen`.
  Columns: No / Kriteria / Sub Kriteria / Indikator / Penjelasan Prodi /
  Nama File / Deskripsi / Aksi (the old Link column is merged into Aksi).
  Section divider rows separate groups.
  Rows are hierarchical: masters are `{ no, id }` (displayed `1.a`); there are
  **no placeholder children** — children are admin-added Bukti Dokumen
  entries, so a row only gets a chevron after its first child exists.
  **CRUD split**: master rows have only a text **Tambah** button (admin only)
  which opens a metadata dialog (fields Kriteria / Sub Kriteria / Indikator /
  Nama File / Deskripsi / Link → Drive) and on save POSTs a child to the API
  (child_no = max+1; `DokumenUpload` in `types.ts` holds
  `kriteria`/`subKriteria`/`indikator`/`namaFile`/`deskripsi`/`link`).
  Child rows: Aksi cell is a single non-wrapping horizontal row — icon-only
  chain button (lucide `Link`, aliased `LinkIcon`) opens `doc.link` (else
  `/spmi`), then icon-only **View File** (lucide `Eye`, disabled until a file
  exists → opens `DocPreviewDialog`: `.docx` rendered in-place via
  lazy-loaded `docx-preview` (`renderAsync`), `.pdf`/`.txt`/`.csv` in an
  `<iframe>`, other formats show a fallback note; footer has Tutup + Download
  using the `download` attr on the server `fileUrl`), then (admin only) Del
  (DELETE via API, also deletes the stored file), Update (reopens the dialog
  prefilled, PUTs `doc` + syncs child `subKriteria`/`indikator`) and Upload (a
  hidden `<input type="file" accept=".pdf,.doc,.docx,.txt,…">` behind a
  label-button — multipart POST to `/api/instrumen/upload`, stores the file in
  `server/uploads/` and sets `fileName`/`fileUrl` on the child). All mutations
  go through the API (persisted to Neon) and reload the table afterward;
  they're gated behind `useAuth().admin` — public visitors see the table
  read-only. Nama File column shows `doc.namaFile` (empty on masters;
  uploading a file does NOT touch this column — `fileName` is only used by the
  preview dialog); Deskripsi shows `doc.deskripsi`. Child rows display
  `doc.kriteria ?? section.nama` in the Kriteria column.
  Penjelasan Prodi is row-level real Excel data (empty for items the prodi
  didn't answer); children show `—`. Kunci Penilaian column is intentionally
  omitted.
- Navbar: SPMI is a hover dropdown; the Akreditasi page is a plain link on
  purpose — labeled **"Akreditasi"** (Navbar, MobileNav, Footer, Home CTA)
  pointing to `/akreditasi` (no dropdown, no `?std=` param) — do
  not reintroduce a Standar menu tree.
- Navbar/MobileNav show **Dashboard** (`/admin`) + **Keluar** only when
  logged in — driven by `useAuth()`. There is **no public login link**:
  only admins know/reach `/login` directly.
- `ScrollToTop` in `App.tsx` scrolls to top on pathname change.

## Backend & auth (Neon Postgres) — Bun dev + single-deploy Vercel

- **One shared handler, two runtimes.** All route logic lives in the
  framework-agnostic `server/handler.ts` (`handleApi(req, path)` + helpers
  `json`/`readJson`/`bearerToken`/`adminFromToken`/`deleteStoredFile`, module
  `pool`, constants `UPLOAD_ALLOWED`/`UPLOAD_MAX_BYTES`). It imports **no Bun
  APIs** — it runs under Bun (dev) and on Vercel's Node runtime.
  Passwords are hashed/verified with **`bcryptjs`** (pure JS, cross-runtime);
  the seed migrates a pre-existing argon2 hash (old `Bun.password`) to bcrypt
  for the default `admin` account.
- **Dev** (`server/index.ts`): runs under **Bun directly** (TS, no build
  step) via `bun server/index.ts`. Deps: `pg` (+ `@types/pg`). Uses
  `Bun.serve`, `Bun.file`, `Bun.write`. On boot runs `migrate()` + `seed()`
  (with retries — Neon is intermittent), delegates `/api/*` to `handleApi`
  except the disk upload, serves `/uploads/*`, and keeps the disk-file upload.
- **Vercel** (`api/`): folder-functions per route
  (`api/auth/login.ts`, `auth/logout.ts`, `auth/me.ts`, `stats.ts`,
  `instrumen.ts`, `instrumen/children.ts`, `instrumen/upload.ts`) —
  thin default-exported `handler(req)` wrappers that delegate to
  `api/_lib/route.ts` → `handleApi`. Files/dirs starting with `_` in `api/`
  are not routed (shared code). Upload on Vercel uses **`@vercel/blob`**
  `put()` (`access: 'public'`, `addRandomSuffix: false`) with `crypto.randomUUID()`
  names and stores the absolute blob URL in `file_url`; reads (preview/
  download) just hit that URL. `deleteStoredFile` removes the blob when
  `BLOB_READ_WRITE_TOKEN` is set, else unlinks `server/uploads/*`.
- `vercel.json`: `buildCommand: "bun run build"`, `installCommand:
  "bun install"`, `outputDirectory: "dist"`, `functions.api/**/*.ts`
  `maxDuration: 30`, SPA fallback rewrite `/((?!api/).*)` → `/index.html`
  (asset/function paths take precedence over rewrites).
- **DB**: Neon Postgres. `.env` (gitignored) holds `DATABASE_URL` (pooled)
  and `DATABASE_URL_NON_POOLING` (+ optional `PORT`, `ADMIN_PASSWORD`).
  Convention: non-pooling URL for DDL/migrations (`server/db.ts` →
  `migrate()`), pooled URL for app queries. Never commit `.env`; a
  `.env.example` with placeholders exists (incl. `BLOB_READ_WRITE_TOKEN` for
  Blob uploads). DDL runs **only** on dev boot (`migrate()`), never on Vercel
  — provision the schema once (locally or via Neon) before deploying.
- `server/schema.sql`: `admins` (a `BEFORE INSERT` trigger
  `enforce_admin_limit()` caps the table at **3 admin accounts max** —
  inserting a 4th raises `Maksimal 3 akun admin`), `sessions`,
  `instrumen_sections`, `instrumen_rows` (adds `penjelasan_prodi TEXT`, kept
  in sync via `ALTER TABLE … ADD COLUMN IF NOT EXISTS`),
  `instrumen_children` (child doc metadata in a `doc JSONB` +
  `file_name`/`file_url`). Boot runs `migrate()` then `seed()`:
  seeds admin `admin` / `admin123` (default, override with
  `ADMIN_PASSWORD`, hashed with **bcryptjs**; the default `admin` row is
  re-hashed if its stored hash isn't bcrypt) when the admins table is empty,
  upserts sections + rows from `src/data/instrumen.ts` every boot (idempotent
  — safe to restart), and deletes placeholder children that have no
  `doc`/file fields.
- API routes (JSON; `Authorization: Bearer <token>` for protected):
  - `POST /api/auth/login` → `{ token, admin }` (7-day session row)
  - `POST /api/auth/logout`, `GET /api/auth/me` (session-backed — auth
    state lives in Neon, not JWT)
  - `GET /api/stats` — counts (protected)
  - `GET /api/instrumen` — full section/row/child tree incl. `penjelasanProdi`
    (public read)
  - `POST /api/instrumen/children` (auth) — create child (`child_no` =
    max+1; requires `{ sectionNo, rowId, doc }`; `subKriteria`/`indikator`
    default to the row's when `doc` doesn't set them)
  - `PUT /api/instrumen/children` (auth) — update child `doc` + sync
    `subKriteria`/`indikator` (`{ sectionNo, rowId, childNo, doc }`)
  - `DELETE /api/instrumen/children` (auth) — delete child; also best-effort
    deletes its stored file (Blob or `server/uploads/*`)
  - `POST /api/instrumen/upload` (auth) — multipart
    `{ file, sectionNo, rowId, childNo }`; extension allowlist
    `.pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx`, ≤ 25 MB. Dev saves
    to `server/uploads/<uuid><ext>` served via `/uploads/*`; Vercel stores it
    in **Blob Storage** and keeps the absolute URL. Either way the child's
    `fileName` (original name) + `fileUrl` get set.
- Frontend: `src/lib/api.ts` (fetch wrapper, token in `localStorage` key
  `akreditasi_token`), `src/context/auth.ts` (`AuthContext` + `useAuth`),
  `src/context/AuthContext.tsx` (`AuthProvider` — restores session on
  mount). Keep the `useAuth` hook out of `AuthContext.tsx` or oxlint's
  `react/only-export-components` warns.
- `/admin` (`pages/Admin.tsx`) is a read-only "tampilan semuanya"
  dashboard: 6 stat cards + full instrumen table with Penjelasan Prodi +
  doc link columns. All data comes from `GET /api/stats` + `GET
  /api/instrumen` (persisted in Neon).
- Vite `server.proxy` in `vite.config.ts` forwards `/api` and `/uploads`
  to `http://localhost:8787` — dev needs both `bun run server` and
  `bun run dev` (or `bun run start`).

## Conventions & branding

- Two coexisting import styles (both valid; match the file you're in):
  - shadcn-generated files: double quotes, `import { cn } from "cn"`
    (the `cn` npm package — `src/lib/utils.ts` re-exports it).
  - Hand-written app code: single quotes, `import { cn } from '@/lib/utils'`.
- Styling: Tailwind utilities + token layer in `src/index.css` (imports
  `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css` — the **runtime**
  `shadcn` dependency provides that CSS; don't remove it — and the
  `@fontsource-variable/plus-jakarta-sans` font). Neutral palette,
  `--primary` overridden to institutional green, Plus Jakarta Sans as
  `--font-sans`. Plain `.css` uses **native CSS nesting** (no
  preprocessor); there is no component-scoped CSS file.
- Institution content is real (Universitas Saintek Muhammadiyah / SaintekMu,
  from saintekmu.ac.id). Branding: site name "Sains Data", Fakultas Ilmu
  Komputer; favicon mark "SD" (`public/favicon.svg` is the only public
  asset); `lang="id"` — UI copy is Indonesian.
- `feat.md` at the root is a stale scratch note (nav outline missing
  Contact), not a spec — do not treat it as authoritative.

## Scope notes

- The parent directory's `../AGENTS.md` documents *sibling* projects
  (titik3, Rynex, …) and does not describe this repo. Ignore its commands
  here; this repo's own config is the source of truth.
