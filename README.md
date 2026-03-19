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
│   ├── layout.tsx                 # Root layout (fonts, metadata)
│   ├── page.tsx                   # Home page
│   └── page.module.scss           # Home page styles
└── payload/
    └── payload.config.ts          # Payload CMS configuration
```

## Build Approach

This project is built **one phase at a time**. Each phase completes fully, the README gets updated, and work stops until the user requests the next phase. Use the **Superintendent** agent at any time for status checks:

- `"what's the status?"` — Get a full progress report
- `"ask the superintendent [question]"` — Get answers about what's built
- `"catch me up"` — Full context restoration after a token reset

**Current Phase:** Phase 2 (Complete) → **Phase 3 next**

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
- **All skills consolidated under `.github/skills/`** for a single-location convention
- **Next.js 15.4.x** (Payload CMS v3 peer dependency requires Next 15, not 14)
- **Package manager**: npm

---

## Next Steps

### Phase 3: Payload Collections & Admin

- [ ] Products collection (with eco-data fields)
- [ ] Categories collection
- [ ] Users collection (with roles)
- [ ] Orders collection (with status workflow)
- [ ] Media collection
- [ ] Pages collection
- [ ] Discounts collection
- [ ] Header, Footer, Settings globals
- [ ] Stripe sync hooks
- [ ] Access control policies

### Phase 4: Core Components

- [ ] Header with navigation + cart icon
- [ ] Footer with links + newsletter
- [ ] Product Card with EcoImpactBadge
- [ ] Hero banner
- [ ] Categories grid
- [ ] Price display
- [ ] Button, Input, Media components
- [ ] Cart context provider
- [ ] Auth context provider

### Phase 5: Pages & Routes

- [ ] Home page (`/`)
- [ ] Products listing (`/products`)
- [ ] Product detail (`/products/[slug]`)
- [ ] Cart (`/cart`)
- [ ] Checkout (`/checkout`)
- [ ] Order confirmation (`/order-confirmation`)
- [ ] Login / Register / Account / Orders
- [ ] Dynamic CMS pages (`/[slug]`)

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

*Last updated: March 19, 2026 — Phase 2 complete (project initialization)*
