# OctoCAT Supply Chain Management Application – General Copilot Instructions

These are repository-wide guidelines. Path‑scoped files in `.github/instructions/*.instructions.md` provide focused guidance for specific areas (frontend, API, database).

## High-Level Architecture

**TypeScript monorepo** with clear separation of concerns:

```
api/                    Express.js REST API
  ├─ src/
  │  ├─ models/        Entity interfaces with Swagger JSDoc
  │  ├─ routes/        Route handlers (thin; logic in repos)
  │  ├─ repositories/  Data access layer (SQL building, type mapping)
  │  ├─ db/           Database connection & migrations
  │  └─ utils/        Error classes, SQL helpers
  └─ database/
     ├─ migrations/   Immutable SQL migration files
     └─ seed/        Deterministic seed data

frontend/               React 18+ + Vite + Tailwind
  ├─ src/
  │  ├─ components/   React components (semantic HTML, a11y first)
  │  ├─ context/      Global state (Auth, Theme)
  │  ├─ api/         API client config & request helpers
  │  └─ assets/      Static files & images
  └─ tests/          Playwright e2e & component tests

database/              Schema & seed files (referenced from api/)
docs/                  Architecture, design decisions, SQLite pattern docs
infra/                 Bicep/IaC for Azure deployment
```

**Key data flow**: Frontend (React) → REST API (Express) → SQLite (repo pattern) → Response.

Refer to [architecture.md](docs/architecture.md) and [sqlite-integration.md](docs/sqlite-integration.md) for deeper details.

## TypeScript Code Standards

### Type Safety & Models
- **No `any`** unless justified with a `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment explaining why.
- **Define interfaces for all DTO/API responses** (e.g., `models/supplier.ts`) with Swagger JSDoc comments.
- **Consistent naming**: camelCase in TypeScript; snake_case in SQL columns with automatic mapping via utility functions.
- **Generic functions** preferred over overloads for flexibility (e.g., `mapDatabaseRows<T>()` in `utils/sql.ts`).

### Error Handling
- Use domain-specific error classes (`NotFoundError`, `ValidationError`, `ConflictError` from `utils/errors.ts`).
- Errors flow: repository throws → route catches → middleware sends proper HTTP status.
- Never expose raw database errors to clients; wrap in application errors.

### Example: Safe repository method
```typescript
async findById(id: number): Promise<Supplier | null> {
  try {
    const row = await this.db.get<DatabaseRow>('SELECT * FROM suppliers WHERE supplier_id = ?', [id]);
    return row ? this.convertBooleanFields(objectToCamelCase<Supplier>(row)) : null;
  } catch (error) {
    handleDatabaseError(error);
  }
}
```

## TypeScript Best Practices (Language-Specific)

1. **Strict mode** always enabled (`tsconfig.json`). New code must compile without `--skipLibCheck=true` workarounds.
2. **Explicit return types** on all functions (no implicit `any` returns).
3. **Use typed databases**: `db.get<DatabaseRow>()` with generics for type safety.
4. **Destructuring & rest parameters** preferred: `const { id, ...rest } = req.body;`
5. **Immutable defaults**: Prefer `const` and readonly arrays/objects.
6. **Avoid `Array<T>` syntax** in favor of `T[]` for consistency.
7. **Promise types**: Always annotate: `async fn(): Promise<T>` or `fn(): Promise<T>`.

## Build & Development Commands

### Install
```bash
make install          # Install all dependencies (API + frontend)
npm install           # From respective workspace directory
```

### Development
```bash
make dev              # Start API (port 3000) & frontend dev server (port 5173) with hot reload
make dev-api          # API only with tsx (faster than full build+run)
make dev-frontend     # Frontend only with Vite dev server
```

### Database
```bash
make db-init          # Run migrations + seed (idempotent)
make db-seed          # Seed only (idempotent check in seed files)
make db-migrate       # Migrations only
cd api && npm run db:init:dev  # Use tsx for faster dev iteration
```

### Build & Test
```bash
make build            # Build both API (tsc) & frontend (vite build)
make build-api        # Compile TypeScript to dist/
make build-frontend   # Bundle for production

npm run test          # Run Vitest (API) or Playwright (frontend) from workspace
npm run test:coverage # Generate coverage reports (api/)
npm run lint          # ESLint both workspaces
npm run lint:fix      # Auto-fix linting issues
```

### Key npm scripts (from api/package.json, frontend/package.json)
- `npm run dev`: Start dev server with auto-reload
- `npm run build`: Compile/bundle for production
- `npm run test`: Run unit/component tests
- `npm run lint`: Check code style
- `npm run lint:fix`: Auto-fix style issues

## Project Conventions & Patterns

### Swagger/OpenAPI Documentation
- **Required** for all API routes. Swagger comments go at the top of each route file (`src/routes/*.ts`).
- Models documented once in `src/models/*.ts` with `@swagger` JSDoc blocks.
- Example: `src/routes/supplier.ts` shows full pattern (GET list, create, get by ID, update, delete with proper 404/409/validation responses).

### Repository Pattern
- One repository per entity (e.g., `suppliersRepo`, `ordersRepo`).
- Methods: `findAll()`, `findById(id)`, `create()`, `update()`, `delete()`.
- Use SQL utility functions for safety: `buildInsertSQL()`, `buildUpdateSQL()` handle parameterization.
- Test repositories with in-memory SQLite database.

### React Patterns (Frontend)
- **Components**: Small, single-responsibility (< ~150 LOC).
- **Context**: Use for auth & theme only; avoid context for simple prop passing.
- **Data fetching**: [React Query](https://react-query.tanstack.com/) for caching & background sync. Example: `Products.tsx` shows `useQuery` pattern.
- **Forms**: Controlled inputs with validation, visible error messages (not just color).
- **Styling**: Tailwind utility classes; extract repeated patterns into small components or `clsx()` helpers.

### Accessibility (a11y)
- **Semantic HTML**: `<button>`, `<form>`, `<label htmlFor="inputId">` (never divs for clickables).
- **ARIA**: Only when native HTML insufficient (e.g., `role="status"` for dynamic status messages).
- **Focus visible**: Preserve default focus rings; test tab navigation.

### Database Migrations
- **Never edit existing migration files**; always create new sequential files (e.g., `001_init.sql`, `002_add_supplier_status_fields.sql`).
- **Idempotent or guarded**: Use `IF NOT EXISTS` where applicable.
- **Include foreign key + index definitions**; verify `PRAGMA foreign_keys=ON` in config.

### Seeding
- **Deterministic**: Explicit INSERT IDs for referential integrity in subsequent seeds.
- **Idempotent**: Check existence before insert to allow re-runs.
- Update seeds when adding NOT NULL columns without defaults.

## Integration Points & Dependencies

### Frontend ↔ API Communication
- Base URL from `VITE_API_URL` environment variable (default `http://localhost:3000`).
- CORS configured in `src/index.ts` for localhost dev + GitHub Codespaces + Azure Container Apps domains.
- Error handling: Catch API errors (4xx/5xx) and display user-friendly messages; log raw errors for debugging.

### External Packages
- **Database**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (sync I/O for simplicity; in-memory for tests).
- **Server**: Express.js + Swagger UI for live API documentation.
- **Frontend**: React 18+, React Router v7, React Query, Tailwind CSS.
- **Testing**: Vitest (API unit tests), Playwright (frontend e2e).
- **Linting**: ESLint + TypeScript ESLint plugin.

## Security & Performance

### Security
- **SQL injection**: Always use parameterized queries (`db.run(sql, [param])`, never string concatenation).
- **CORS**: Restrict origins in production; currently allows GitHub Codespaces & Azure Container Apps.
- **Error leaks**: Never expose database stack traces; wrap in application errors.
- **Pagination**: Constrain `limit/offset` to prevent table scans.

### Performance
- **N+1 queries**: Watch repository methods; prefer JOINs over per-row SELECT loops.
- **Frontend**: Lazy-load routes/heavy components; use `React.memo` for stable list items.
- **Bundling**: Monitor bundle size in Vite build output.

## General Review Guidance
When generating suggestions:
1. Prefer incremental, minimal diffs; preserve existing style and naming.
2. Surface security, correctness, and data integrity issues before micro-optimizations.
3. Encourage type safety (no `any` unless justified). Suggest adding/refining model or DTO types when gaps appear.
4. Flag duplicate logic that belongs in a shared utility or repository method.
5. Ensure error handling uses existing custom error types where appropriate (e.g., NotFound, Validation, Conflict) and propagates consistent HTTP status codes via middleware.
6. Encourage tests: request unit tests for new repository logic and component tests (or at least React Testing Library coverage) for critical UI paths.
7. For performance concerns, highlight N+1 query patterns, unnecessary data loading, or large bundle additions.
8. Prefer environment variable driven configuration; avoid hard-coded paths/secrets.

## Monorepo Workflow

- **Build frequently**: `make build` or `npm run build --workspace=api|frontend`.
- **Keep PRs scoped**: code + tests + docs (architecture or build notes) when behavior changes.
- **Update instruction files** if new folders/patterns are introduced (e.g., adding a new service → `.github/instructions/<service>.instructions.md`).

## Do Not Repeat
Do not inline full API route or component files in review feedback unless absolutely necessary: quote only the lines requiring change. Summarize low-impact nits.

## Escalation Order for Suggestions
1. Security / data integrity
2. Logical / functional correctness
3. Performance / scalability
4. Maintainability / duplication
5. Readability / consistency
6. Style / minor formatting

## Tone & Feedback Style
Be concise, actionable, and cite a rationale ("because" clause) for non-trivial recommendations. Offer one preferred solution; optionally a lightweight alternative.

---
If new subsystems are added (e.g., `mobile/`, `worker/`), create a new `*.instructions.md` with `applyTo` globs instead of bloating this file.
