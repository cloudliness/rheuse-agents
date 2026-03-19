---
name: ecommerce-build
description: 'Build full-stack eco-friendly ecommerce websites for RHEUSE. Use when: creating product pages, shopping cart, checkout flow, payment integration, product categories, admin dashboard, user authentication, order management, or any ecommerce storefront feature. Keywords: ecommerce, shop, store, cart, checkout, products, orders, payments, Stripe, RHEUSE, eco-friendly, sustainable, green, reuse, recycled.'
---

# RHEUSE Ecommerce Build

Build and maintain a premium eco-friendly ecommerce platform for **RHEUSE** — a sustainable, environmentally-conscious brand selling reusable, recycled, and eco-friendly products.

## When to Use

- Scaffolding or building any part of the RHEUSE ecommerce storefront
- Creating product listing, detail, or category pages
- Implementing shopping cart, checkout, or payment flows
- Setting up an admin dashboard or CMS for product management
- Adding user authentication (login, register, account, orders)
- Integrating Stripe for payments
- Building promotional sections, hero banners, or landing pages
- Any frontend or backend ecommerce feature for the RHEUSE platform

## Phased Build Process

This project is built **one phase at a time**. Follow this workflow strictly:

### Rules

1. **One phase per session** — Complete all tasks in the current phase, then **STOP**
2. **Do not start the next phase** until the user explicitly says to proceed (e.g., "next phase", "build phase 3", "continue")
3. **Update README.md** at the end of every phase (see README Maintenance below)
4. **Invoke the Superintendent** — Before starting any phase, ask the Superintendent agent for a status report to confirm current state. Also invoke it if unsure about what's been completed.
5. **Report completion** — When a phase is done, output a brief summary:
   - What was built
   - Files created/modified
   - Any decisions made
   - What the next phase will cover

### Phase Order

| Phase | Name | Description |
|-------|------|-------------|
| 1 | Agent & Skill Architecture | Skills, agents, README *(complete)* |
| 2 | Project Initialization | Next.js, Payload, MongoDB, SCSS vars, env files, git |
| 3 | Payload Collections & Admin | Products, Categories, Users, Orders, Media, Pages, Globals, hooks |
| 4 | Core Components | Header, Footer, Card, Hero, Cart provider, Auth provider, UI primitives |
| 5 | Pages & Routes | Home, Products, Product Detail, Cart, Checkout, Account, Login, CMS pages |
| 6 | Payments & Checkout | Stripe integration, webhooks, checkout form, order creation |
| 7 | RHEUSE Features | Eco Dashboard, Eco Scores, Certifications, Carbon Shipping, Impact Receipt |
| 8 | SEO & Performance | Metadata, JSON-LD, sitemap, image optimization, Suspense |
| 9 | Docker & Deployment | Dockerfile, docker-compose (dev + prod), health check, full-stack test |

### How to Start a Phase

```
User: "build phase 2" / "start phase 3" / "next phase"
```

Agent workflow:
1. Invoke the **Superintendent** agent to get current status
2. Confirm which phase is next and what it covers
3. Build all items in that phase
4. Update `README.md` (move completed items, update timestamp)
5. Output the phase completion summary
6. **STOP and wait** for user to request the next phase

### Invoking the Superintendent

At any time, the user can ask:
- "what's the status?" / "where are we?" / "check progress"
- "ask the superintendent [question]"
- "catch me up"

The agent should invoke the **Superintendent** subagent, which will scan the codebase and report against its 60+ item build checklist.

## README Maintenance

**After every phase completion**, update `README.md` in the project root:

1. Move completed items from "Next Steps" to "What's Been Done" with a brief note
2. Check off items in the phase that was just completed
3. Add any new decisions to "Key Decisions Made"
4. Update the "Last updated" timestamp at the bottom
5. Update the status line to reflect the current phase

Keep the README concise — it serves as the quick-reference for anyone (human or agent) opening the project. The Superintendent agent uses it alongside its own checklist for context restoration.

## Brand Identity — RHEUSE

| Attribute | Value |
|-----------|-------|
| **Company Name** | RHEUSE |
| **Tagline** | "Reuse. Reimagine. Reshape the future." |
| **Mission** | Make sustainable living accessible through beautifully designed, eco-friendly products |
| **Voice** | Warm, purposeful, optimistic — never preachy |
| **Target Audience** | Environmentally-conscious consumers, ages 22–45, who value quality and design |

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#2D6A4F` | Primary actions, CTAs, links (deep forest green) |
| `--color-primary-light` | `#52B788` | Hover states, accents (vibrant green) |
| `--color-primary-dark` | `#1B4332` | Text on light backgrounds, headings |
| `--color-accent` | `#D4A373` | Warm accent, badges, highlights (sandy earth) |
| `--color-background` | `#FEFAE0` | Page background (warm cream) |
| `--color-surface` | `#FFFFFF` | Cards, modals, elevated surfaces |
| `--color-text` | `#2B2D42` | Body text (near-black with warmth) |
| `--color-text-muted` | `#6C757D` | Secondary text, captions |
| `--color-success` | `#40916C` | Success states, in-stock indicators |
| `--color-error` | `#E63946` | Errors, out-of-stock, destructive actions |

### Typography

- **Headings**: `"Playfair Display", serif` — elegant, editorial
- **Body**: `"Inter", sans-serif` — clean, modern readability
- **Accent/Labels**: `"DM Sans", sans-serif` — compact, technical

### Design Principles

1. **Earth-inspired aesthetics**: Natural textures, organic shapes, soft shadows
2. **Whitespace-forward**: Let products breathe — generous padding and margins
3. **Photography-first**: Large, high-quality product imagery with natural lighting
4. **Sustainability callouts**: Every product should surface its eco impact (recycled %, carbon saved, etc.)
5. **Accessible**: WCAG 2.1 AA minimum — proper contrast, keyboard navigation, screen reader support

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | Full-stack React framework with SSR/SSG |
| **Language** | TypeScript | Type safety throughout |
| **CMS** | Payload CMS | Headless CMS with admin dashboard |
| **Database** | MongoDB | Flexible document storage for products/orders |
| **Payments** | Stripe | Checkout, subscriptions, webhooks |
| **Styling** | SCSS Modules | Scoped, maintainable styles |
| **Deployment** | Docker / Vercel | Containerized or serverless deployment |
| **Auth** | Payload built-in | User accounts, sessions, roles |

## Project Structure

```
src/
├── app/
│   ├── (pages)/                    # Route group (no layout impact)
│   │   ├── [slug]/                 # Dynamic CMS-driven pages
│   │   ├── products/               # Product listing & detail pages
│   │   │   ├── page.tsx            # All products / shop page
│   │   │   └── [slug]/             # Individual product detail
│   │   ├── cart/                   # Shopping cart page
│   │   ├── checkout/               # Checkout flow (shipping, payment)
│   │   ├── order-confirmation/     # Post-purchase confirmation
│   │   ├── orders/                 # Order history
│   │   ├── account/                # User account management
│   │   ├── login/                  # Login page
│   │   ├── create-account/         # Registration page
│   │   ├── logout/                 # Logout handler
│   │   ├── recover-password/       # Password recovery
│   │   └── reset-password/         # Password reset
│   ├── _components/                # Shared UI components
│   │   ├── Header/                 # Site header with nav + cart icon
│   │   ├── Footer/                 # Site footer with links + newsletter
│   │   ├── Hero/                   # Hero banner component
│   │   ├── Card/                   # Product card component
│   │   ├── Categories/             # Category grid/list
│   │   ├── CollectionArchive/      # Product collection grid with filters
│   │   ├── AddToCartButton/        # Add to cart CTA
│   │   ├── RemoveFromCartButton/   # Remove from cart
│   │   ├── CartLink/               # Cart icon with item count badge
│   │   ├── Price/                  # Price display with currency formatting
│   │   ├── Promotion/             # Promotional banner/section
│   │   ├── Media/                  # Responsive image/video component
│   │   ├── Pagination/             # Page navigation for lists
│   │   ├── Button/                 # Reusable button component
│   │   ├── Input/                  # Form input component
│   │   ├── RichText/               # CMS rich text renderer
│   │   └── EcoImpactBadge/         # RHEUSE-specific eco metrics badge
│   ├── _blocks/                    # CMS content blocks
│   ├── _heros/                     # Hero section variants
│   ├── _providers/                 # React context providers (cart, auth, theme)
│   ├── _graphql/                   # GraphQL queries and fragments
│   ├── _api/                       # API utility functions
│   ├── _css/                       # Global styles and variables
│   ├── _utilities/                 # Shared utility functions
│   ├── api/                        # Next.js API routes
│   ├── constants/                  # App constants
│   └── layout.tsx                  # Root layout
├── payload/
│   ├── collections/                # Payload CMS collections
│   │   ├── Products.ts             # Product schema (name, price, images, eco-data)
│   │   ├── Categories.ts           # Product categories
│   │   ├── Orders.ts               # Order records
│   │   ├── Users.ts                # Customer accounts
│   │   ├── Media.ts                # Uploaded images/files
│   │   └── Pages.ts                # CMS-managed pages
│   ├── globals/                    # Payload globals (header, footer, settings)
│   ├── blocks/                     # Reusable content blocks for pages
│   ├── fields/                     # Shared field definitions
│   ├── hooks/                      # Collection hooks (beforeChange, afterChange)
│   ├── access/                     # Access control policies
│   ├── endpoints/                  # Custom API endpoints
│   ├── stripe/                     # Stripe webhook handlers
│   │   └── webhooks/               # Webhook processing
│   ├── seed/                       # Database seed data
│   ├── utilities/                  # Payload utilities
│   └── payload.config.ts           # Payload configuration
├── server.ts                       # Custom Express server
└── server.default.ts               # Default server export
```

## Implementation Guide

### 1. Product Data Model

Every product in RHEUSE must include eco-friendly metadata:

```typescript
// Payload collection fields for Products
{
  name: 'products',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number', required: true },
    { name: 'compareAtPrice', type: 'number' },  // original price for showing savings
    { name: 'images', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media' }
    ]},
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    // RHEUSE eco-specific fields
    {
      name: 'ecoData',
      type: 'group',
      fields: [
        { name: 'recycledPercentage', type: 'number', min: 0, max: 100 },
        { name: 'carbonSavedKg', type: 'number' },
        { name: 'materials', type: 'array', fields: [
          { name: 'material', type: 'text' }
        ]},
        { name: 'certifications', type: 'select', hasMany: true, options: [
          'Fair Trade', 'Organic', 'B Corp', 'Carbon Neutral',
          'FSC Certified', 'Cradle to Cradle', 'GOTS', 'OEKO-TEX'
        ]},
        { name: 'ecoStatement', type: 'textarea' },
      ]
    },
    { name: 'stripeProductID', type: 'text', admin: { readOnly: true } },
    {
      name: 'stock', type: 'number', defaultValue: 0,
      admin: { description: 'Inventory count' }
    },
  ]
}
```

### 2. Product Card Component

```tsx
// src/app/_components/Card/index.tsx
import React from 'react'
import Link from 'next/link'
import { Media } from '../Media'
import { Price } from '../Price'
import { EcoImpactBadge } from '../EcoImpactBadge'
import classes from './index.module.scss'

export const Card: React.FC<{ product: Product }> = ({ product }) => {
  const { title, slug, images, price, ecoData, categories } = product

  return (
    <Link href={`/products/${slug}`} className={classes.card}>
      <div className={classes.mediaWrapper}>
        {images?.[0]?.image && <Media resource={images[0].image} />}
        {ecoData?.recycledPercentage && (
          <EcoImpactBadge percentage={ecoData.recycledPercentage} />
        )}
      </div>
      <div className={classes.content}>
        {categories?.[0] && (
          <span className={classes.category}>
            {typeof categories[0] === 'string' ? categories[0] : categories[0].title}
          </span>
        )}
        <h3 className={classes.title}>{title}</h3>
        <Price amount={price} />
        {ecoData?.certifications?.length > 0 && (
          <div className={classes.certifications}>
            {ecoData.certifications.map((cert) => (
              <span key={cert} className={classes.certBadge}>{cert}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

### 3. Shopping Cart (Context Provider)

```tsx
// src/app/_providers/Cart/index.tsx
'use client'
import React, { createContext, useContext, useReducer, useCallback } from 'react'

type CartItem = { product: Product; quantity: number }
type CartState = { items: CartItem[]; }

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, { product: action.product, quantity: action.quantity }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

const CartContext = createContext<{
  cart: CartState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
} | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', productId, quantity })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

### 4. Checkout with Stripe

```typescript
// src/app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: Request) {
  const { items } = await req.json()
  // Validate items server-side against DB prices (never trust client prices)
  const amount = await calculateOrderTotal(items)

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderItems: JSON.stringify(items.map((i) => i.id)) },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
```

### 5. Eco Impact Badge Component

A RHEUSE-specific component showing sustainability metrics on every product:

```tsx
// src/app/_components/EcoImpactBadge/index.tsx
import React from 'react'
import classes from './index.module.scss'

type Props = {
  percentage?: number
  carbonSaved?: number
  compact?: boolean
}

export const EcoImpactBadge: React.FC<Props> = ({ percentage, carbonSaved, compact }) => {
  if (!percentage && !carbonSaved) return null

  return (
    <div className={`${classes.badge} ${compact ? classes.compact : ''}`}>
      {percentage && (
        <span className={classes.metric}>
          <span className={classes.icon}>♻️</span>
          <span>{percentage}% recycled</span>
        </span>
      )}
      {carbonSaved && (
        <span className={classes.metric}>
          <span className={classes.icon}>🌱</span>
          <span>{carbonSaved}kg CO₂ saved</span>
        </span>
      )}
    </div>
  )
}
```

### 6. Key Pages to Build

| Page | Route | Key Features |
|------|-------|-------------|
| **Home** | `/` | Hero with brand mission, featured products, category grid, eco impact counter, promotions |
| **Shop/Products** | `/products` | Filterable product grid (by category, price, eco-certification), pagination, sort options |
| **Product Detail** | `/products/[slug]` | Image gallery, full eco data, add to cart, related products, reviews |
| **Cart** | `/cart` | Line items, quantity controls, running total, eco impact summary for entire cart |
| **Checkout** | `/checkout` | Shipping form, Stripe payment element, order review |
| **Order Confirmation** | `/order-confirmation` | Thank you message, order summary, eco impact of purchase |
| **Account** | `/account` | Profile, address book, saved payment methods |
| **Orders** | `/orders` | Order history with status tracking |
| **Login** | `/login` | Email/password auth via Payload |
| **Register** | `/create-account` | Account creation form |
| **Categories** | `/[slug]` | Category-specific product listings |

### 7. RHEUSE-Specific Features

These features differentiate RHEUSE from a generic store:

1. **Eco Impact Dashboard**: Show aggregate environmental impact on the homepage (total items reused, CO₂ saved, plastic diverted) — pull from product-level data
2. **Product Eco Scores**: Visual rating (leaf icons or progress rings) for recycled content, carbon footprint, ethical sourcing
3. **Sustainability Certifications**: Badge system showing Fair Trade, Organic, B Corp, etc.
4. **Carbon-Neutral Shipping Option**: Offer carbon offset at checkout
5. **"Why Eco?" Content Blocks**: CMS-driven educational sections explaining the environmental benefit of each product category
6. **Refill/Return Program CTAs**: Encourage product returns for recycling/refill
7. **Impact Receipt**: After purchase, email a personalized eco-impact summary

### 8. SEO & Performance

- Server-side render all product and category pages
- Generate `sitemap.xml` from product/category slugs
- Add structured data (`Product`, `Offer`, `BreadcrumbList` JSON-LD) to product pages
- Use `next/image` with responsive sizing for all product photos
- Implement `generateMetadata()` on every page with RHEUSE branding
- Lazy-load below-fold sections with `Suspense` boundaries

### 9. Admin Dashboard (Payload CMS)

Payload provides the admin dashboard at `/admin`. Configure:

- **Products**: Full CRUD with eco-data fields, image uploads, Stripe sync
- **Categories**: Hierarchical categories with images and descriptions
- **Orders**: View and manage customer orders, process refunds
- **Pages**: CMS-managed content pages (About, FAQ, Sustainability)
- **Media**: Image library with alt text and optimization
- **Users**: Customer accounts and admin roles
- **Globals**: Header navigation, footer content, site-wide settings

### 10. Environment Variables & Docker Deployment

See the **`devops-deploy`** skill for full environment configuration, Dockerfile, docker-compose setup, and container deployment procedures.

## Code Conventions

- Use **TypeScript strict mode** — no `any` types
- Component folders: `ComponentName/index.tsx` + `index.module.scss`
- Use SCSS modules for all component styles; global styles only in `_css/`
- Prefix private app directories with `_` (e.g., `_components`, `_providers`)
- Use Next.js App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Server Components by default; add `'use client'` only when needed
- All prices stored in cents (integer) — format for display only at render time
- Validate all user input server-side; never trust client-submitted prices or quantities
- Use `parameterized queries` / Payload's built-in query builder — never construct raw DB queries from user input