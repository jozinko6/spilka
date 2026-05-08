# Task 2-a: Seed Script & API Routes

## Summary
Created the database seed script and all CRUD API routes for the SPILKA Terasa restaurant project.

## Work Completed

### 1. Seed Script (`prisma/seed.ts`)
- Seeds all data into the SQLite database:
  - **Admin user**: username `admin`, password `spilka2026`
  - **6 Menu Categories** with all items: Polievky (5), Hlavné jedlá (6), Spilka špeciality (4), Flammkuchen (3), Šaláty (3), Prílohy & Dezerty (7) = 28 total menu items
  - **5 Daily Menu entries** (Monday–Friday)
  - **8 Events** (quiz nights, music, Valentine's)
  - **8 Gallery Images** (interior, food, beer, terrace, etc.)
- Includes cleanup (deletes all existing data before seeding)
- Run with: `bun prisma/seed.ts` or `bun run seed`

### 2. Package.json Updates
- Added `"prisma": { "seed": "bun prisma/seed.ts" }` config
- Added `"seed": "bun prisma/seed.ts"` script

### 3. Admin Auth Helper (`src/lib/admin-auth.ts`)
- Simple token-based auth check via `x-admin-token` header
- Token value: `spilka-admin-2026`
- Returns 401 if token is missing or incorrect

### 4. Admin API Routes (all require `x-admin-token` header)

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/menu-categories` | GET, POST | List all categories with items / Create category |
| `/api/admin/menu-categories/[id]` | GET, PUT, DELETE | Get/Update/Delete single category |
| `/api/admin/menu-items` | GET, POST | List items (filter by ?categoryId=) / Create item |
| `/api/admin/menu-items/[id]` | GET, PUT, DELETE | Get/Update/Delete single item |
| `/api/admin/daily-menu` | GET, POST | List/Create daily menu entries |
| `/api/admin/daily-menu/[id]` | PUT, DELETE | Update/Delete daily menu entry |
| `/api/admin/events` | GET, POST | List/Create events |
| `/api/admin/events/[id]` | PUT, DELETE | Update/Delete event |
| `/api/admin/gallery` | GET, POST | List/Create gallery images |
| `/api/admin/gallery/[id]` | PUT, DELETE | Update/Delete gallery image |
| `/api/admin/auth` | POST | Login (username+password check) |

### 5. Public API Routes (no auth required)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/menu` | GET | Active categories with active items |
| `/api/daily-menu` | GET | Active daily menus ordered by dayOfWeek |
| `/api/events` | GET | Active events ordered by date desc |
| `/api/gallery` | GET | Active gallery images ordered by order |

## Verification
- ✅ Seed script runs successfully, populating all data
- ✅ Lint passes with no errors
- ✅ All public API endpoints return correct data
- ✅ Admin endpoints blocked without auth token (returns 401)
- ✅ Admin endpoints work with correct `x-admin-token` header
- ✅ Auth login endpoint works with admin credentials
- ✅ Dev server running without errors
