# RMS Version Roadmap

## Version 1 — MVP (Weeks 1–6)
Target: Working product for real restaurant feedback.

- Login / Authentication
- Staff roles (Owner, Manager, Cashier, Waiter)
- Restaurant profile setup
- Table management (floor map with indoor + terrace areas)
- Menu management (**Nepali cuisine**: momo, dal bhat, chhoila, thukpa, etc. with **allergens**, **course types**, set menus)
- Take orders (course-based: starter → main → dessert, **cover count**)
- Kitchen Display System (real-time via Socket.IO, course-sequential firing)
- Generate bills (**10% consumption tax**, split by cover, JPY format ¥1,234)
- Payment methods: Cash, **Suica/Pasmo (IC)**, Card, **QR Pay (PayPay, LINE Pay)**
- Basic inventory (stock tracking, auto-deduct, low-stock alerts)
- Sales dashboard with **VAT report** + **average cover value**
- Basic CI (lint + test on PR)
- Frontend on **Cloudflare Pages** (auto-deploy from GitHub)
- Backend on **Render.com** or **Railway.app** (no VPS/Docker needed)
- Database on **Neon.tech** or **Supabase** (free PostgreSQL)
- Cloudflare DNS + rate limiting

## Version 2 — Growth (2–3 months after V1)
Target: Expand reach and revenue capabilities.

- Subscription billing (Stripe)
- QR code ordering (customer self-scan)
- Customer loyalty program
- Reservations / bookings
- Online ordering (web storefront)
- Delivery integration (Zomato, Swiggy, UberEats)
- Multi-branch support
- Advanced analytics & reports
- Mobile app (React Native)
- Full CI/CD pipeline (auto-deploy)
- Sentry error tracking
- Prometheus / Grafana monitoring
- Multi-language / i18n
- Load testing with k6

## Version 3 — Advanced (3–6 months after V2)
Target: AI-powered automation and enterprise features.

- AI sales forecasting
- Demand prediction
- Automatic inventory purchasing suggestions
- Voice ordering
- Staff scheduling & time tracking
- Payroll management
- Accounting integrations (QuickBooks, Xero)
- Third-party API integrations
- White-label option for enterprise clients