# RHEUSE

**Reuse. Reimagine. Reshape the future.**

An eco-friendly ecommerce platform selling sustainable, reusable, and recycled products. Built for environmentally-conscious consumers who value quality and design.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack React with SSR/SSG |
| Language | TypeScript | Type safety throughout |
| CMS | Payload CMS | Headless CMS with admin dashboard |
| Database | MongoDB | Document storage for products/orders |
| Payments | Stripe | Checkout, webhooks |
| Styling | SCSS Modules | Scoped component styles |
| Deployment | Docker | Containerized with docker-compose |

## Project Structure

```
.github/
├── agents/
│   └── superintendent.agent.md    # Build progress tracker & context restorer
└── skills/
    ├── ecommerce-build/           # Storefront architecture & implementation
    ├── marketing/                 # SEO copywriting & color psychology
    ├── devops-deploy/             # Docker containerization & deployment
    └── admin-crm/                 # Back-office user/product/order management
src/
├── app/
│   ├── _css/                      # Global SCSS variables & reset
│   ├── _components/               # Shared UI components
│   │   ├── AddToCartButton/       # Add-to-cart with feedback animation
│   │   ├── Button/                # Filled + outlined variants
│   │   ├── Card/                  # Product card with eco badge
│   │   ├── CartLink/              # Cart icon with item count badge
│   │   ├── Categories/            # Category grid with image overlays
│   │   ├── EcoImpactBadge/        # Recycled % + CO₂ saved badge
│   │   ├── Footer/                # Columns + social + copyright
│   │   ├── Header/                # Site header (nav + cart + account)
│   │   ├── Hero/                  # Hero banner with CTAs
│   │   ├── Input/                 # Form input with label + error
│   │   ├── Media/                 # Responsive image (next/image)
│   │   ├── MissionSection/        # Brand story editorial section
│   │   ├── Newsletter/            # Email signup section
│   │   ├── Price/                 # Currency formatter (cents → display)
│   │   ├── QuantityStepper/       # +/- quantity control
│   │   └── RichText/              # Payload Lexical content renderer
│   ├── _providers/                # React context providers
│   │   ├── Cart/                  # Cart state (localStorage persisted)
│   │   ├── Auth/                  # User auth via Payload API
│   │   └── index.tsx              # Combined provider wrapper
│   ├── (pages)/                   # Route group for all pages
│   │   ├── [slug]/                # Dynamic CMS pages
│   │   ├── account/               # User profile (protected)
│   │   ├── cart/                   # Shopping cart
│   │   ├── checkout/              # Checkout with shipping form
│   │   ├── create-account/        # Registration
│   │   ├── login/                 # Sign in
│   │   ├── order-confirmation/    # Post-purchase thank you
│   │   ├── orders/                # Order history (protected)
│   │   └── products/              # Product listing + [slug] detail
│   ├── layout.tsx                 # Root layout (fonts, metadata, providers)
│   ├── page.tsx                   # Home page
│   └── page.module.scss           # Home page styles
└── payload/
    ├── payload.config.ts          # Payload CMS configuration
    ├── access/
    │   └── roles.ts               # Access control helpers (isAdmin, etc.)
    ├── fields/
    │   ├── slug.ts                # Shared slug field with auto-generation
    │   └── link.ts                # Shared link field (internal/external)
    ├── collections/
    │   ├── Users.ts               # Auth + roles + addresses
    │   ├── Media.ts               # Image uploads with sizes
    │   ├── Categories.ts          # Hierarchical product categories
    │   ├── Products.ts            # Products with eco-data & stock hooks
    │   ├── Orders.ts              # Orders with status workflow & stock hooks
    │   ├── Pages.ts               # CMS content pages
    │   └── Discounts.ts           # Promo codes & discounts
    └── globals/
        ├── Header.ts              # Nav links + CTA
        ├── Footer.ts              # Columns + social + newsletter
        └── Settings.ts            # Site-wide settings + SEO defaults
```

## Build Approach

This project is built **one phase at a time**. Each phase completes fully, the README gets updated, and work stops until the user requests the next phase. Use the **Superintendent** agent at any time for status checks:

- `"what's the status?"` — Get a full progress report
- `"ask the superintendent [question]"` — Get answers about what's built
- `"catch me up"` — Full context restoration after a token reset

**Current Phase:** Phase 5 (Complete) → **Phase 6 next**

## What's Been Done

### Phase 1: Agent & Skill Architecture (Complete)

All foundational skills and agents have been defined. These provide the blueprint and domain knowledge for building the platform.

#### Skills Created

| Skill | Description |
|-------|-------------|
| **ecommerce-build** | Core storefront architecture — brand identity, color palette, typography, project structure, product data model, cart provider, Stripe checkout, component templates, page routing, SEO patterns |
| **marketing** | SEO product description framework, keyword strategy by category, color psychology mapping (7 palette colors with psychological effects), 6 conversion color rules, 7 persuasion principles, structured data templates, image alt text formulas, quality checklist |
| **devops-deploy** | Multi-stage Dockerfile, dev & prod docker-compose configs, .dockerignore, env file templates, volume strategy (MongoDB + media), networking rules, health check endpoint, common commands, troubleshooting guide |
| **admin-crm** | Role hierarchy (super-admin/admin/editor/customer), Users collection with access control, Orders collection with status workflow, Discounts collection, Stripe sync hooks, inventory management, bulk price update endpoint, CSV import, access control helpers |

#### Agents Created

| Agent | Purpose |
|-------|---------|
| **Superintendent** | Read-only project manager — scans codebase against 60+ item build checklist, produces status reports, restores context when conversations reset |

### Phase 2: Project Initialization (Complete)

Project scaffolded with all core configs, styles, and environment setup.

| Item | Status | Notes |
|------|--------|-------|
| Next.js + TypeScript | ✅ | Next.js 15.4.x (Payload v3 requires 15.x) |
| Payload CMS | ✅ | `payload.config.ts` with MongoDB adapter + Lexical editor |
| MongoDB connection | ✅ | Configured via `MONGODB_URI` env var |
| `next.config.mjs` | ✅ | Standalone output, `withPayload()` wrapper |
| `tsconfig.json` | ✅ | Strict mode, path aliases `@/*` and `@payload/*` |
| SCSS global variables | ✅ | Brand colors, typography, spacing, breakpoints, shadows |
| `.env.local` + `.env.example` | ✅ | All required vars templated |
| `.gitignore` | ✅ | node_modules, .next, .env files, media |
| Root layout | ✅ | Google Fonts loaded (Playfair Display, Inter, DM Sans) |
| Home page | ✅ | Placeholder with hero section |
| Git initialized | ✅ | Initial commit on `master` branch |

### Key Decisions Made

- **Brand colors**: Deep forest green (`#2D6A4F`) primary, sandy earth (`#D4A373`) accent, warm cream (`#FEFAE0`) background
- **Typography**: Playfair Display (headings), Inter (body), DM Sans (labels)
- **CMS**: Payload CMS with admin at `/admin`
- **Payments**: Stripe with server-side price validation
- **Deployment**: Docker-only (no Vercel)
- **Design system**: Matched to user's design mockups — square corners, ALL-CAPS labels, editorial whitespace, italic serif headings
- **SCSS tokens updated**: Darker CTA green `#1F4D38`, softer charcoal text `#2E2E2E`, warm grey surface-alt `#F5F3EE`, 0px border-radius
- **Typography utilities**: Letter-spacing for labels (0.12em), buttons (0.08em), font-size scale (11px–18px)
- **Next.js 15.4.x** (Payload CMS v3 peer dependency requires Next 15, not 14)
- **Package manager**: npm

---

### Phase 3: Payload Collections & Admin (Complete)

All Payload CMS data models, access control, and hooks are in place.

| Item | Status | Notes |
|------|--------|-------|
| Users collection | ✅ | Auth, roles (super-admin/admin/editor/customer), addresses, stripeCustomerID |
| Media collection | ✅ | Image uploads with 3 sizes (thumbnail/card/hero), alt text required |
| Categories collection | ✅ | Hierarchical with parent self-reference, slug auto-gen |
| Products collection | ✅ | Eco-data group, price in cents, stock hooks (prevent negative, low-stock warning) |
| Orders collection | ✅ | 7-state status workflow, auto order number, stock decrement on confirm |
| Pages collection | ✅ | Rich text content, SEO meta group |
| Discounts collection | ✅ | Percentage/fixed/free-shipping, validity dates, usage limits |
| Header global | ✅ | Nav links array (max 8) + CTA button |
| Footer global | ✅ | Columns with links, social links, newsletter, copyright |
| Settings global | ✅ | Site name, tagline, SEO defaults, contact info |
| Access control | ✅ | Role-based helpers: isAdmin, isSuperAdmin, isAdminOrSelf, isAdminOrOwner, etc. |
| Shared fields | ✅ | Slug (auto-gen from title) and Link (internal/external) reusable fields |
| Config wired | ✅ | All 7 collections + 3 globals registered in payload.config.ts |

---

### Phase 4: Core Components (Complete)

All reusable UI components, layout components, and state providers are in place.

| Item | Status | Notes |
|------|--------|-------|
| Button | ✅ | Filled + outlined variants, square corners, ALL-CAPS, link-or-button |
| Input | ✅ | Label, placeholder, error state, styled to match design |
| Media | ✅ | Responsive `next/image` wrapper, fill mode, resource object support |
| Price | ✅ | Cents → currency format, compare-at price with strikethrough |
| EcoImpactBadge | ✅ | Recycled % + CO₂ saved, compact variant for cards |
| Header | ✅ | Logo (italic serif), centered nav links, cart + account icons, sticky |
| CartLink | ✅ | Shopping bag icon with item count badge |
| Footer | ✅ | 4-column grid, logo + tagline, link columns, social, copyright bar |
| Hero | ✅ | Full-bleed with gradient overlay, label + heading + accent italic + CTAs |
| Card (Product) | ✅ | Image with eco badge overlay, category label, title, price |
| Categories grid | ✅ | 2-col + full-width last, image overlays, "Explore Series" CTAs |
| Newsletter | ✅ | Centered section, email input + subscribe button |
| CartProvider | ✅ | useReducer, localStorage persistence, add/remove/update/clear |
| AuthProvider | ✅ | Payload /api/users endpoints, login/logout/createAccount |
| Providers wrapper | ✅ | `<Providers>` wraps Auth + Cart, used in root layout |
| Layout wired | ✅ | Header + Footer + Providers in root layout.tsx |

---

### Phase 5: Pages & Routes (Complete)

All frontend pages and routes are built with server-side data fetching and client-side interactivity.

| Item | Status | Notes |
|------|--------|-------|
| Home page (`/`) | ✅ | Hero, MissionSection, Categories grid, Newsletter |
| Products listing (`/products`) | ✅ | Server component, Payload API fetch, 3-column grid, empty state |
| Product detail (`/products/[slug]`) | ✅ | Image gallery, eco data, materials, certifications, AddToCartButton |
| Cart (`/cart`) | ✅ | Line items with QuantityStepper, Order Summary sidebar, trust badges |
| Checkout (`/checkout`) | ✅ | Shipping form (Input components), order review sidebar, Stripe placeholder |
| Order confirmation (`/order-confirmation`) | ✅ | Thank you, order details, eco impact message |
| Login (`/login`) | ✅ | Email/password form, useAuth provider, redirect to account |
| Register (`/create-account`) | ✅ | Full registration form, auto-login after creation |
| Account (`/account`) | ✅ | Protected profile page, order history link, logout |
| Orders (`/orders`) | ✅ | Protected order list, date/status/total, links to confirmation |
| Dynamic CMS pages (`/[slug]`) | ✅ | Fetches from Payload Pages collection, RichText renderer, Hero support |

---

## Next Steps

### Phase 6: Payments & Checkout

- [ ] Stripe payment intent API route
- [ ] Checkout form with Stripe Elements
- [ ] Webhook handler for payment confirmation
- [ ] Order creation on successful payment
- [ ] Carbon-neutral shipping option

### Phase 7: RHEUSE Features

- [ ] Eco Impact Dashboard (homepage)
- [ ] Product Eco Scores (visual rating)
- [ ] Sustainability Certifications badges
- [ ] "Why Eco?" content blocks
- [ ] Refill/Return Program CTAs
- [ ] Impact Receipt (post-purchase)

### Phase 8: SEO & Performance

- [ ] `generateMetadata()` on all pages
- [ ] JSON-LD structured data
- [ ] Sitemap generation
- [ ] `next/image` optimization
- [ ] Suspense boundaries

### Phase 9: Docker & Deployment

- [ ] Create `Dockerfile` (multi-stage)
- [ ] Create `docker-compose.yml` (dev)
- [ ] Create `docker-compose.prod.yml` (production)
- [ ] Create `.dockerignore`
- [ ] Health check endpoint (`/api/health`)
- [ ] Test full stack locally with Docker

---

## Development

```bash
# Start with Docker (recommended)
docker compose up

# Or run directly
npm install
npm run dev
```

Admin dashboard: `http://localhost:3000/admin`

## Brand

| | |
|---|---|
| **Company** | RHEUSE |
| **Tagline** | Reuse. Reimagine. Reshape the future. |
| **Mission** | Make sustainable living accessible through beautifully designed, eco-friendly products |
| **Audience** | Eco-conscious consumers, 22–45, who value quality and design |

---

*Last updated: Phase 5 complete (all pages & routes)*
