<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Runtime and structure

- Use npm and Node.js 20.9 or newer; `package-lock.json` pins the single root package.
- The live application is the App Router tree under `app/`. `app/layout.tsx` owns the document shell and global styles; `app/page.tsx` is `/`.
- `@/*` resolves from the repository root, not from `app/`.
- Tailwind CSS 4 is CSS-first here: `app/globals.css` imports Tailwind and defines theme tokens; there is no `tailwind.config.*`.
- `references/pantallas/*.dc.html` and `references/screenshots/` are product UI references, not application entrypoints. `references/pantallas/support.js` is generated; do not edit it.

## Commands

- Development: `npm run dev` (http://localhost:3000).
- App lint: `npm run lint -- app`. Focused lint: `npm run lint -- app/page.tsx` (replace the path as needed).
- Bare `npm run lint` also scans generated `references/pantallas/support.js` and currently fails; do not edit that generated file to satisfy lint.
- Type-only verification requires generated route helpers: run `npx next typegen`, then `npx tsc --noEmit`.
- Production verification: run `npm run lint -- app`, then `npm run build`; the build includes TypeScript checking.
- No test script or test-runner configuration currently exists.

## Tooling

- Keep screenshots and all Playwright artifacts under `.playwright-mcp/`; the directory contents are gitignored.
- Use Context7 for current framework documentation; for installed Next.js behavior, prefer the version-matched local guides required above.

## Supabase

- Load the `supabase` skill for every task involving Supabase Database, Auth, Storage, Realtime, Edge Functions, client/SSR integration, CLI, MCP, logs, or troubleshooting.
- Before writing or changing SQL, schemas, migrations, RLS policies, indexes, triggers, functions, queues, or other Postgres resources, also load `supabase-postgres-best-practices` and follow its relevant rule files.
- Treat the `docs` reference (`../07-DB-Schema`) as the intended database design only. Inspect the live database before changing it; the reference is not proof that a table, column, relationship, policy, or migration has already been implemented.
- Check current Supabase documentation before implementation. Prefer the Supabase MCP `search_docs` tool, then official documentation pages; check the changelog for relevant breaking changes.
- Every persistent database change must be implemented and applied through a versioned imperative migration, including schema, RLS, functions, triggers, indexes, and controlled data changes. Never make ad hoc persistent changes through `execute_sql`, the Supabase dashboard, or direct SQL outside a migration; reserve `execute_sql` for read-only inspection and verification queries.
- Before creating a migration, inspect the live database and the existing migration history. Use Supabase MCP `apply_migration` for database changes and keep the corresponding migration represented in the repository's migration workflow.
- Do not use Docker, `supabase start`, or a local Supabase stack for development or tests. The connected Supabase project is the development and testing database; run database verification and application tests against that project, taking care not to treat it as production or depend on disposable local state.
- Enable RLS on every table in an exposed schema and create least-privilege policies for the actual ownership or tenancy model. Never expose `service_role` or secret keys to client code; use publishable keys in the frontend.
- After database changes, verify behavior with a query or focused test and run Supabase security and performance advisors. Do not consider a database change complete without verification.
- Discover installed Supabase CLI commands and flags with `supabase --help` and command-specific `--help`; do not rely on remembered CLI syntax.

## Installed Skills

- `supabase` (`.agents/skills/supabase/SKILL.md`): mandatory workflow, security checklist, current documentation, CLI/MCP usage, migrations, and troubleshooting for all Supabase work.
- `supabase-postgres-best-practices` (`.agents/skills/supabase-postgres-best-practices/SKILL.md`): mandatory companion for Postgres schema, SQL, RLS, migrations, performance, connections, locking, monitoring, and advanced database features.

## Spec Driven Development

- `/spec` usa la skill de especificaciones para crear y aprobar una spec antes de implementar.
- `/spec-impl` usa la skill de implementación para desarrollar una spec aprobada paso a paso.
- `@spec-verifier @specs/<spec>.md` invoca directamente el agente `spec-verifier` para validar la fidelidad funcional y visual, ejecutar las verificaciones requeridas y reportar riesgos residuales.

## Reglas de Código

- Usar código limpio, nombres, funciones, variables, etc en inglés y pensar en componentes.
