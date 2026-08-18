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

## Spec Driven Development - Skills

- /spec Usaremos esta skill para crear las especificaciones.
- /spec-impl Usaremos esta skill para realizar las implementaciones.
