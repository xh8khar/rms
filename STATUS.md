# RMS Project Status

## Current Day: Day 5
## Phase: Core Features
## Status: In progress

## Target: Nepali restaurants in Japan
- Menu: Nepali cuisine (momo, dal bhat, chhoila, sekuwa, etc.)
- Currency: JPY (¥1,234 — no decimals)
- Location: Tokyo / Japan
- Course-based ordering (starter → main → dessert)
- EU allergen labels (14 allergens), 10% consumption tax

## Last Completed Task:
Day 4 — Backend Auth Module (register, login, JWT, roles guard)

## Current Task:
Day 5 — Frontend Auth Setup (login page, auth context, protected routes)

## Next Tasks:
Day 6 — Restaurant Profile CRUD
Day 8-9 — Menu Module (Nepali dishes with allergens)
Day 10-11 — Table Management
Day 12-14 — Order Module (course-based)
Day 15-17 — Socket.IO + Kitchen Display
Day 18-19 — Billing & Invoices (JPY, 10% tax)
Day 20-21 — Inventory
Day 22-23 — Reports Dashboard
Day 24+ — RBAC, Polish, Testing, Deploy

## Deployment Target (Beginner-friendly):
- Frontend: **Cloudflare Pages** (auto-deploy from GitHub)
- Backend: **Render.com** or **Railway.app** (no VPS/Docker needed)
- Database: **Neon.tech** or **Supabase** (free PostgreSQL)
- Domain: Cloudflare DNS

## Notes:
- Using SQLite locally for dev, will switch to PostgreSQL for production
- Seed data: Himalayan Kitchen (Nepali restaurant in Shinjuku)
- Login: admin / 1234
