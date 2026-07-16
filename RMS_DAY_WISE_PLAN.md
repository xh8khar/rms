# RMS Project — Day-Wise Development & Testing Plan (V1)

> **Scope:** Version 1 per `versions.md` | 42 Days | 4 Roles | 9 Features
> **Goal:** Working product for real restaurant feedback
> **Style:** Nepali restaurant in Japan — Nepali cuisine, JPY currency, Japanese address/location, EU allergen labels, 24h time, DD/MM/YYYY

## Restaurant Style — Design Philosophy
- **Cuisine:** Nepali dishes (momo, dal bhat, chhoila, sekuwa, thukpa, etc.)
- **Location:** Tokyo / Japan — Japanese addresses, JPY currency (¥1,234 — no decimals), 10% consumption tax
- **Terminology:** "Bill" not "check", "Starter" not "appetizer", "Cover" for guest count. Service charge usually 0% (common in Japan).
- **Compliance:** EU allergen labeling (14 allergens) for international customers, consumption tax (10%) on bills.
- **Formatting:** JPY currency (¥1,234 — no decimals), DD/MM/YYYY dates, 24-hour time, metric units.
- **Payments:** Cash, Contactless/NFC (Suica/Pasmo), Card, QR Pay (PayPay, LINE Pay).
- **Service flow:** Course-based ordering (starter → main → dessert), sequential kitchen firing.

---

## Phase 1: Foundation & Setup (Days 1–7)

### Day 1 — Project Scaffolding
- [ ] Init NestJS backend with TypeScript (`nest new rms-api`)
- [ ] Init React frontend with Vite + TypeScript
- [ ] Configure Tailwind CSS in frontend
- [ ] Set up ESLint + Prettier in both projects
- [ ] Create monorepo structure (npm workspaces)
- [ ] **Verify:** `npm run dev` starts both servers without errors

### Day 2 — Database & ORM
- [ ] Install & configure Prisma with PostgreSQL connection
- [ ] Design V1 database schema (all 9 features)
- [ ] Schema includes: **allergen info** (14 EU allergens), **wine vintage/year**, **VAT rates** (standard/reduced), **service charge %**, **course type** (starter/main/dessert), **cover count**
- [ ] Run `prisma migrate dev` — create tables
- [ ] Seed script with European sample data (Italian/French restaurant: pasta, wine list, set menus)
- [ ] **Test:** All tables created; seed runs cleanly

### Day 3 — Database Setup (No Docker needed)
- [ ] Create free PostgreSQL database on **Neon.tech** or **Supabase**
- [ ] (Optional) Create free Redis on **Upstash** if needed later
- [ ] Add DATABASE_URL to .env
- [ ] .env.example with all required variables
- [ ] **Test:** `prisma db push` connects and creates tables remotely

### Day 4 — Backend Auth Module
- [ ] Install Passport.js / JWT packages
- [ ] Auth module: register, login, refresh token, logout
- [ ] Role-based guards (Owner, Manager, Cashier, Waiter)
- [ ] Multi-tenant middleware (isolate data by restaurant_id)
- [ ] **Test:** Register user → login → get JWT → call protected route → 200

### Day 5 — Frontend Auth Setup
- [ ] React Router setup with protected routes
- [ ] Login/Register pages with React Hook Form
- [ ] Auth context/provider with JWT storage
- [ ] TanStack Query setup for API calls
- [ ] **Test:** Full login flow → redirect to dashboard → logout works

### Day 6 — Restaurant Profile CRUD
- [ ] Backend: Restaurants module (CRUD + logo upload)
- [ ] Frontend: Restaurant setup wizard form
- [ ] Multi-tenant isolation enforcement
- [ ] **Test:** Create restaurant → edit → view → delete; data isolated per tenant

### Day 7 — Buffer / Catch-up
- [ ] Fix any unresolved issues from Days 1–6
- [ ] Write integration tests for auth + restaurant flows
- [ ] **Test:** `npm test` passes all tests

---

## Phase 2: Core Business Features (Days 8–21)

### Day 8 — Menu Module Backend
- [ ] MenuCategory CRUD (name, description, sort_order)
- [ ] MenuItem CRUD (name, description, price, category, modifiers, availability)
- [ ] Add **course_type** field (Starter, Main, Dessert, Beverage, Wine) on each item
- [ ] **Allergen tags** — store 14 EU allergen IDs per item (gluten, dairy, eggs, nuts, etc.)
- [ ] **Wine list support** — vintage/year, region, appellation, grape variety
- [ ] **Set menu / Table d'hôte** — fixed-price menus with multiple courses
- [ ] Image upload for menu items
- [ ] **Test:** Create category → add items with allergens → fetch menu → all endpoints 200

### Day 9 — Menu Module Frontend
- [ ] Menu management page (list categories, drag-and-drop reorder)
- [ ] Add/Edit menu item modal/form with **course type** selector (Starter/Main/Dessert/etc.)
- [ ] **Allergen picker** — visual grid of 14 EU allergens with icons (gluten, dairy, nuts, etc.)
- [ ] **Wine editor** — fields for vintage, region, appellation, grape
- [ ] **Set menu builder** — assign multiple course items to a fixed price
- [ ] Image upload UI with preview
- [ ] Toggle availability (in-stock / out-of-stock)
- [ ] **Test:** UI CRUD operations sync with API; images upload correctly

### Day 10 — Table Management Backend
- [ ] Table CRUD (table_number, capacity, section, status)
- [ ] Table status enum: Available, Occupied, Reserved, Cleanup
- [ ] **Test:** Create tables → assign section → update status

### Day 11 — Table Management Frontend
- [ ] Restaurant floor map (grid layout of tables)
- [ ] Click table to change status
- [ ] Visual status indicators (green=available, red=occupied, etc.)
- [ ] **Test:** Visual floor plan reflects API state; status changes in real-time

### Day 12 — Order Module Backend
- [ ] Order model (table_id, status, items, total, created_by, **cover_count**)
- [ ] OrderItem model (menu_item_id, quantity, modifiers, price, **course_type**)
- [ ] **Course-based ordering** — items grouped by course (starter served first, then main, then dessert)
- [ ] **Sequential kitchen firing** — kitchen only sees next course after previous is served
- [ ] Create order → add items → update quantity → remove items
- [ ] Order status flow: Pending → Confirmed → Preparing → Served → Paid
- [ ] **Test:** Full order lifecycle via API with course sequencing

### Day 13 — Order Module Frontend (Waiter Flow)
- [ ] New order screen: select table → enter **cover count** → browse menu → add items by course
- [ ] **Course tabs** — view/serve items by course (Starter → Main → Dessert → Beverage)
- [ ] Active orders list with status badges
- [ ] Edit / split / transfer order
- [ ] **Test:** Place order with covers → course-based view works → update items

### Day 14 — Order Module — Edge Cases
- [ ] Handle concurrent orders (optimistic locking / versioning)
- [ ] Offline queue for orders (service worker basis)
- [ ] Partial payments on orders
- [ ] **Test:** Two waiters modify same order; conflict prevention works

### Day 15 — Socket.IO Real-time Setup
- [ ] Install Socket.IO client + server
- [ ] Gateway module in NestJS for WebSocket events
- [ ] Join room per restaurant_id
- [ ] **Test:** Client connects → receives real-time events → disconnects cleanly

### Day 16 — Kitchen Display System (KDS) Backend
- [ ] KDS endpoint: GET /orders/kitchen (filter by Preparing status)
- [ ] WebSocket event: `order.new`, `order.status_changed`
- [ ] Mark items as "Preparing" → "Ready"
- [ ] **Test:** Waiter places order → kitchen sees it in real-time

### Day 17 — KDS Frontend
- [ ] KDS view: large-card layout, auto-refresh via WebSocket
- [ ] Order cards with items, modifiers, table number, timers, **cover count**
- [ ] **Course-based view** — show only current course items to prepare
- [ ] "Start Preparing" → "Mark Ready" buttons
- [ ] Alert sound for new orders
- [ ] **Test:** Place order on POS → card appears on KDS in < 1s; course sequencing works

### Day 18 — Billing & Invoices Backend
- [ ] Invoice model (order_id, subtotal, **VAT breakdown**, **service charge**, discount, total, payment_method)
- [ ] **VAT** — support standard rate (e.g. 20%) + reduced rate (e.g. 10%) per item category
- [ ] **Service charge** — auto-include configurable % (10% / 12.5% / 15%) on bill total
- [ ] Generate invoice on order payment (DD/MM/YYYY date, JPY format)
- [ ] Split bill by cover (per person)
- [ ] Payment methods: Cash, **Contactless/NFC**, Card, **Meal Vouchers (Ticket Restaurant)**, **Bancontact / iDEAL**
- [ ] **Test:** Pay for order → VAT calculated correctly → service charge included → invoice prints in EU format

### Day 19 — Billing Frontend
- [ ] Payment screen: view order summary with **VAT line items** + **service charge**
- [ ] Select payment method (Cash, Card, Contactless, Meal Voucher, Bancontact/iDEAL)
- [ ] **Split by cover** — divide bill equally per person
- [ ] Invoice display / print with JPY formatting: ¥1,234 (no decimals), DD/MM/YYYY, 24h time
- [ ] **Test:** Full payment flow → invoice with correct VAT, service charge, EU format

### Day 20 — Inventory Management Backend
- [ ] InventoryItem CRUD (name, sku, quantity, unit, min_stock)
- [ ] Stock movement log (purchase_in, waste, sold)
- [ ] Auto-deduct stock when order items are prepared
- [ ] Low-stock alerts (threshold check)
- [ ] **Test:** Create item → place order → stock deducts → low-stock alert fires

### Day 21 — Inventory Frontend
- [ ] Inventory list with search/filter
- [ ] Stock adjustment form (add stock, write-off)
- [ ] Low-stock warning badges
- [ ] **Test:** UI operations match API; low-stock badge appears correctly

---

## Phase 3: Reports, Polish & Testing (Days 22–30)

### Day 22 — Reports Dashboard Backend
- [ ] Daily sales report endpoint (aggregate by day)
- [ ] Popular items report (top-selling menu items)
- [ ] Table turnover report
- [ ] **Test:** Seed data → reports return correct aggregation

### Day 23 — Reports Dashboard Frontend
- [ ] Dashboard page with summary cards (today's revenue, orders count, **average cover value**)
- [ ] **VAT report** — show collected VAT per rate (standard vs reduced)
- [ ] Sales chart (Recharts / Chart.js) with JPY formatting
- [ ] Popular items table
- [ ] Date range picker with DD/MM/YYYY format
- [ ] **Test:** Charts render with data; VAT breakdown correct; date filter works

### Day 24 — Role-Based Access Control (RBAC) UI
- [ ] Admin panel for role management (Owner only)
- [ ] Invite staff members via email
- [ ] Frontend route guards per role
- [ ] **Test:** Waiter cannot access KDS; Manager cannot access billing config

### Day 25 — UI/UX Polish — European Aesthetic
- [ ] **Design pass** — minimalist European look: clean whites, muted earth tones, serif headings, generous whitespace
- [ ] Responsive design pass (mobile-friendly)
- [ ] Loading states (skeleton loaders)
- [ ] Error boundaries & toast notifications
- [ ] Empty states in European style ("Nessun ordine" / "Keine Bestellungen" style placeholder)
- [ ] **All formatting** — JPY currency (¥1,234), DD/MM/YYYY dates, 24-hour time throughout
- [ ] **Allergen icons** displayed on menu items (wheat, milk, egg, fish, etc.)
- [ ] **Test:** All screens usable at 375px and 1920px widths; EU formatting everywhere

### Day 26 — Unit Tests — Backend
- [ ] Jest config for NestJS
- [ ] Test all services (AuthService, OrderService, MenuService, etc.)
- [ ] Test guards & decorators
- [ ] Mock Prisma service
- [ ] **Target:** > 80% coverage on services

### Day 27 — Unit Tests — Frontend
- [ ] Vitest / Jest config for React
- [ ] Test custom hooks (useAuth, useOrders, etc.)
- [ ] Test components (render, user interaction)
- [ ] Mock TanStack Query hooks
- [ ] **Target:** > 70% coverage on components

### Day 28 — Integration Tests
- [ ] Backend: request → controller → service → database round-trip
- [ ] Use testcontainers for PostgreSQL in CI
- [ ] Auth → order → payment pipeline test
- [ ] **Test:** `npm run test:e2e` passes all integration tests

### Day 29 — End-to-End Tests
- [ ] Cypress / Playwright setup
- [ ] Login → Create Menu → Set Tables → Place Order → KDS → Bill flow
- [ ] Multi-role test scenarios
- [ ] **Test:** `npx cypress run` passes all E2E specs

### Day 30 — Buffer & Bug Fixes
- [ ] Fix all P0/P1 bugs found during testing
- [ ] Complete any incomplete features
- [ ] **Test:** All 9 V1 features working end-to-end

---

## Phase 4: Deployment & Go-Live (Days 31–42)

### Day 31 — Basic CI Setup
- [ ] GitHub Actions: lint + test on PR
- [ ] GitHub Actions: build check
- [ ] **Test:** Push to branch → CI runs automatically

### Day 32 — Cloudflare Pages Setup (Frontend)
- [ ] Create Cloudflare Pages project
- [ ] Connect GitHub repo for auto-deploy
- [ ] Configure build command: `npm run build` (Vite)
- [ ] Set build output directory: `dist`
- [ ] Add custom domain (e.g. `pos.yourdomain.com`)
- [ ] **Test:** Push to main → CF Pages auto-deploys; site loads on custom domain

### Day 33 — Backend Deployment (No VPS / Docker needed)
- [ ] Deploy NestJS backend on **Render.com** (free tier) or **Railway.app**
- [ ] Connect GitHub repo → auto-deploy on push
- [ ] Set environment variables (DATABASE_URL, JWT_SECRET, etc.) in Render dashboard
- [ ] Point API subdomain (e.g. `api.yourdomain.com`) to Render via Cloudflare DNS
- [ ] **Test:** API reachable via `api.yourdomain.com`; frontend on CF Pages calls API

### Day 34 — Database Backup & Security
- [ ] Automated DB backup (cron + Cloudflare R2 / S3)
- [ ] Rate limiting (NestJS throttle)
- [ ] Cloudflare WAF rules (block malicious traffic)
- [ ] JWT security review (expiry, refresh rotation)
- [ ] **Test:** Backup file created; rate limit kicks in after N requests

### Day 35 — Basic Monitoring
- [ ] Error logging with file transport (Winston)
- [ ] Cloudflare Analytics for traffic monitoring
- [ ] Uptime check (Better Uptime / Cronjob)
- [ ] **Test:** Trigger error → appears in logs

### Day 36 — Documentation
- [ ] API docs (Swagger / OpenAPI)
- [ ] README with setup instructions
- [ ] Deployment guide
- [ ] Simple user manual for restaurant staff
- [ ] **Test:** New developer can set up project in < 30 min following README

### Day 37 — Data Migration Tool
- [ ] CSV import for menu items
- [ ] Manual restaurant onboarding form
- [ ] **Test:** Import 50 menu items from CSV → verify in UI

### Day 38 — Pilot Onboarding
- [ ] Create super admin account
- [ ] Onboard pilot restaurant (setup profile, tables, menu, staff)
- [ ] Training session with restaurant staff
- [ ] **Test:** Pilot restaurant completes full service cycle

### Day 39 — Bug Bash
- [ ] Full-day testing with simulated restaurant service
- [ ] Log all bugs in GitHub Issues
- [ ] Fix P0 bugs immediately
- [ ] **Test:** All P0 bugs resolved; P1 < 5 remaining

### Day 40 — Final QA Pass
- [ ] Regression test all 9 V1 features
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] **Test:** All V1 features working across browsers

### Day 41 — Production Smoke Test
- [ ] Simulate lunch rush (10+ orders in 30 min)
- [ ] Verify KDS, billing, inventory all update correctly
- [ ] **Test:** No crashes; response times acceptable

### Day 42 — Go-Live
- [ ] Pilot restaurant goes live
- [ ] Support channel established (Slack / WhatsApp)
- [ ] Debrief & V2 planning session
- [ ] **Test:** Pilot restaurant runs 1 full service day without critical issues

---

## V1 Feature Checklist

| # | Feature | Backend | Frontend | Tested |
|---|---------|---------|----------|--------|
| 1 | Login / Auth | ✓ | ✓ | ✓ |
| 2 | Roles (Owner, Manager, Cashier, Waiter) | ✓ | ✓ | ✓ |
| 3 | Table Management (indoor + terrace) | ✓ | ✓ | ✓ |
| 4 | Menu Management (w/ allergens, wine, courses) | ✓ | ✓ | ✓ |
| 5 | Take Orders (course-based, cover count) | ✓ | ✓ | ✓ |
| 6 | Kitchen Display (course-sequential) | ✓ | ✓ | ✓ |
| 7 | Generate Bills (VAT, service charge, EU format) | ✓ | ✓ | ✓ |
| 8 | Basic Inventory | ✓ | ✓ | ✓ |
| 9 | Sales Dashboard (VAT report, avg cover) | ✓ | ✓ | ✓ |

---

## Testing Summary (V1)

| Test Type | Tool | Target |
|-----------|------|--------|
| Unit (Backend) | Jest | > 80% coverage |
| Unit (Frontend) | Vitest | > 70% coverage |
| Integration | Jest + Testcontainers | All pipelines pass |
| E2E | Cypress / Playwright | Full happy path |
| Cross-browser | Manual | 4 major browsers |
| Mobile | Manual | iOS + Android |

---

## V2 Roadmap (Future)

Once V1 is live with pilot customers, V2 adds:

- Subscription billing (Stripe)
- QR code ordering
- Customer loyalty program
- Reservations
- Online ordering
- Delivery integration
- Multi-branch support
- Advanced analytics
- Mobile app (React Native)
- Full CI/CD with Sentry monitoring
- Sentry error tracking
- Prometheus metrics
- Multi-language / i18n
- Load testing with k6

## V3 Roadmap (Future)

- AI sales forecasting
- Demand prediction
- Auto inventory purchasing suggestions
- Voice ordering
- Staff scheduling
- Payroll
- Accounting integrations
- Third-party API integrations
