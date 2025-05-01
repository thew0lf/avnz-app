**AVNZ APP Planning and Architecture**

---

## 1. Overview
AVNZ APP is a modern dashboard application consisting of a Laravel-powered REST API and an Inertia + React frontend, backed by MongoDB Atlas. The architecture emphasizes modularity, testability, and compliance with SOC2 standards.

## 2. Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
    - **ODM**: `jenssegers/laravel-mongodb` + native MongoDB PHP driver
    - **Auth**: JWT (via `tymon/jwt-auth`) for stateless API authentication
    - **Coding Standards**: PSR-12, strict type hints, comprehensive docblocks
    - **Testing**: PestPHP for unit tests, PHPUnit for integration tests
    - **API Docs**: Swagger/OpenAPI spec auto-generated via `darkaonline/l5-swagger`

- **Frontend**: Inertia.js + React (TypeScript)
    - **UI Library**: shadcn/ui components
    - **Data Tables**: `@tanstack/react-table`
    - **Build**: Vite with React and TypeScript support
    - **Form Management**: React Hook Form + Zod for schema validation
    - **Styling**: Tailwind CSS (with `tailwind.config.js`)

- **Database**: MongoDB Atlas
    - Multi-environment clusters (dev, staging, prod)
    - Indexed collections for high-performance reads
    - Aggregation pipelines for reporting

- **DevOps & CI/CD**
    - Docker Compose for local development
    - GitHub Actions workflows for linting, testing, and deploy
    - Environments managed via `.env` and GitHub Secrets
    - Deployment targets: AWS ECS (Fargate) behind ALB + CloudFront

## 3. Directory Structure

```
avnz-app/
├─ app/                 # Laravel app code (Models, Controllers, Services, Repos)
├─ bootstrap/           # Framework bootstrap files
├─ config/              # Configuration (database, cache, auth)
├─ database/            # Migrations (if any) & seeders
├─ public/              # Public assets and entrypoint
├─ resources/
│  ├─ views/            # Inertia root view & error pages
│  └─ tsx/              # React page components & shared UI
├─ routes/
│  ├─ api.php           # API routes
│  └─ web.php           # Inertia web routes
├─ scripts/             # Utility scripts (Python, Bash)
├─ storage/             # Logs, cache, file uploads
├─ tests/               # Pest and PHPUnit tests mirroring `app/` structure
├─ .github/             # GitHub Actions workflows
├─ docker-compose.yml   # Local dev stack
├─ .env.example         # Environment variable template
├─ composer.json        # PHP dependencies & metadata
├─ package.json         # NPM dependencies & metadata
├─ vite.config.ts       # Vite build config
└─ tailwind.config.js   # Tailwind CSS configuration
```

## 4. Coding & Documentation Standards

- **PSR-12**: All PHP code must strictly follow PSR-12; run `composer cs-check` pre-commit.
- **Docblocks**: Every class, method, and function must have a PHPDoc block with parameter and return types.
- **Type Hints**: Use scalar and object type hints; return types are mandatory.
- **Tests**: For every new feature or bugfix:
    - **Unit Tests**: At least one happy-path, one edge-case, and one failure scenario.
    - **Integration/E2E**: Core API endpoints and critical UI flows.
- **Git Workflows**:
    - Feature branches named `feature/xxx`, PRs must pass CI checks before merge.
    - Use GitHub Issues + `TASK.md` to track progress.

## 5. Security & Compliance

- **SOC2/HIPAA**: Ensure encryption at rest (MongoDB Atlas) and in transit (TLS everywhere).
- **Environment Secrets**: No secrets in code; manage via environment variables and GitHub Secrets.
- **Input Validation**: All API inputs validated via Form Requests and Zod schemas.
- **Logging & Monitoring**: Structured logs (JSON) stored in `storage/logs`, integrate with CloudWatch.

## 6. Next Steps & Milestones

1. **Environment Bootstrapping**
    - Finalize `docker-compose.yml` for Laravel, MongoDB, Redis, Node.
    - Create initial `.env.example` with MongoDB URI placeholders.
2. **Proof-of-Concept**
    - Scaffold a sample `User` model, JWT login endpoint, and a protected Inertia dashboard page.
    - Write sample Pest tests for auth flow.
3. **Component Library & Styles**
    - Initialize Tailwind and `shadcn/ui` in the frontend.
    - Create a reusable data-table component with sorting/pagination.
4. **Full CRUD & Aggregations**
    - Define core domain models (e.g. Study, Template, Translation).
    - Implement API endpoints and corresponding React pages.
5. **Testing & Documentation**
    - Expand test coverage to 80%+.
    - Publish OpenAPI docs and user setup guides.

---

*Last updated: 2025-04-30*
