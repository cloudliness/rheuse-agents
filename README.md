# RHEUSE

**Reuse. Reimagine. Reshape the future.**

An eco-friendly ecommerce platform selling sustainable, reusable, and recycled products. Built for environmentally-conscious consumers who value quality and design.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack React with SSR/SSG |
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
```

## Build Approach

This project is built **one phase at a time**. Each phase completes fully, the README gets updated, and work stops until the user requests the next phase. Use the **Superintendent** agent at any time for status checks:

- `"what's the status?"` — Get a full progress report
- `"ask the superintendent [question]"` — Get answers about what's built
- `"catch me up"` — Full context restoration after a token reset

**Current Phase:** Phase 1 (Complete) → **Phase 2 next**

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

### Key Decisions Made

- **Brand colors**: Deep forest green (`#2D6A4F`) primary, sandy earth (`#D4A373`) accent, warm cream (`#FEFAE0`) background
- **Typography**: Playfair Display (headings), Inter (body), DM Sans (labels)
- **CMS**: Payload CMS with admin at `/admin`
- **Payments**: Stripe with server-side price validation
- **Deployment**: Docker-only (no Vercel)
- **All skills consolidated under `.github/skills/`** for a single-location convention

---

## Next Steps

### Phase 2: Project Initialization

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install and configure Payload CMS
- [ ] Set up MongoDB connection
- [ ] Configure `next.config.js` (standalone output, image domains)
- [ ] Create `tsconfig.json` with strict mode
- [ ] Set up SCSS with global variables (brand colors, typography)
- [ ] Create `.env.local` from the devops-deploy template
- [ ] Initialize git repo with `.gitignore`

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
yarn install
yarn dev
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

*Last updated: March 19, 2026 — Phase 1 complete (skills & agent architecture)*
