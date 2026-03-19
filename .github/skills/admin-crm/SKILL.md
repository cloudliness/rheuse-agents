---
name: admin-crm
description: 'Admin dashboard and CRM for RHEUSE ecommerce. Use when: managing users, customers, products, prices, inventory, orders, refunds, discounts, roles, permissions, bulk operations, or any back-office administration task. Also use when building Payload CMS admin views, custom endpoints, collection hooks, access control, or data import/export. Keywords: admin, CRM, dashboard, users, customers, products, inventory, orders, refunds, pricing, discounts, roles, permissions, bulk, import, export, Payload CMS, back-office, management.'
---

# RHEUSE Admin & CRM

Back-office administration and customer relationship management for the **RHEUSE** ecommerce platform, built on **Payload CMS** at `/admin`.

## When to Use

- Building or customizing the Payload admin dashboard
- Managing products (CRUD, pricing, inventory, images, eco-data)
- Managing users and customers (roles, permissions, order history)
- Processing orders (view, status updates, refunds)
- Setting up discounts, promotions, or coupon codes
- Building custom admin views or endpoints
- Writing collection hooks (validation, side effects, Stripe sync)
- Configuring access control policies
- Importing/exporting data (products, customers, orders)
- Tracking inventory levels and low-stock alerts

## Admin Architecture

Payload CMS provides the admin UI automatically from collection/global definitions. The admin lives at `/admin` and is only accessible to users with admin roles.

```
/admin
├── /collections
│   ├── /products        # Product CRUD + eco-data + Stripe sync
│   ├── /categories      # Category hierarchy
│   ├── /orders          # Order management + status workflow
│   ├── /users           # Customer + admin accounts
│   ├── /media           # Image/file library
│   ├── /pages           # CMS-managed content pages
│   ├── /discounts       # Promo codes and discount rules
│   └── /reviews         # Product reviews (moderation)
├── /globals
│   ├── /header          # Navigation links
│   ├── /footer          # Footer content
│   └── /settings        # Site-wide settings (brand, SEO defaults)
└── /custom-views
    ├── /analytics        # Sales + eco-impact dashboard
    └── /inventory        # Low-stock alerts, bulk updates
```

## User & Role Management

### Role Hierarchy

| Role | Access | Use Case |
|------|--------|----------|
| **super-admin** | Full access to everything | Site owner, technical lead |
| **admin** | All collections, no settings/code changes | Store manager |
| **editor** | Products, categories, pages, media only | Content team |
| **customer** | Own account, own orders only | End-user (storefront) |

### Users Collection

```typescript
// src/payload/collections/Users.ts
import type { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  access: {
    // Admins can read all users; customers can only read themselves
    read: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    // Only admins can create users via admin panel
    create: ({ req: { user } }) =>
      user?.role === 'super-admin' || user?.role === 'admin',
    // Users can update themselves; admins can update anyone
    update: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    // Only super-admins can delete users
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        // Only super-admins can change roles
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },   // "Home", "Work"
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'stripeCustomerID', type: 'text', admin: { readOnly: true } },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: { readOnly: true },
    },
  ],
}
```

## Product Management

### Pricing Rules

- **All prices stored in cents** (integer) — never floating point
- `price` is the current selling price
- `compareAtPrice` is the original/MSRP price (shown crossed out when higher than `price`)
- Discount percentage is calculated at render time: `Math.round((1 - price / compareAtPrice) * 100)`

### Inventory Management

```typescript
// Hook: prevent overselling
const validateStock: CollectionBeforeChangeHook = async ({ data, originalDoc, operation }) => {
  if (operation === 'update' && data.stock !== undefined) {
    if (data.stock < 0) {
      throw new Error('Stock cannot be negative')
    }
  }
  return data
}

// Hook: low stock alert (log or notify)
const checkLowStock: CollectionAfterChangeHook = async ({ doc }) => {
  if (doc.stock <= 5 && doc.stock > 0) {
    console.warn(`Low stock alert: "${doc.title}" has ${doc.stock} units remaining`)
    // TODO: Send notification to admin (email, Slack, etc.)
  }
  if (doc.stock === 0) {
    console.warn(`Out of stock: "${doc.title}"`)
  }
}
```

### Stripe Sync Hook

Keep Payload products in sync with Stripe:

```typescript
// Hook: sync product to Stripe on create/update
const syncToStripe: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  if (operation === 'create') {
    const product = await stripe.products.create({
      name: doc.title,
      metadata: { payloadID: doc.id },
    })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: doc.price,
      currency: 'usd',
    })
    // Update the Payload doc with Stripe IDs (no infinite loop — skip hooks)
    await req.payload.update({
      collection: 'products',
      id: doc.id,
      data: { stripeProductID: product.id },
      depth: 0,
    })
  }

  if (operation === 'update' && doc.stripeProductID) {
    await stripe.products.update(doc.stripeProductID, {
      name: doc.title,
    })
  }
}
```

## Order Management

### Order Status Workflow

```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
│ pending  │───▶│ confirmed │───▶│ shipped  │───▶│ delivered │
└─────────┘    └───────────┘    └──────────┘    └───────────┘
     │              │                                  │
     ▼              ▼                                  ▼
┌───────────┐  ┌───────────┐                    ┌───────────┐
│ cancelled │  │ refunded  │                    │ returned  │
└───────────┘  └───────────┘                    └───────────┘
```

### Orders Collection

```typescript
// src/payload/collections/Orders.ts
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') return true
      return { customer: { equals: user?.id } }
    },
    create: () => true,  // Checkout creates orders
    update: ({ req: { user } }) =>
      user?.role === 'super-admin' || user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    { name: 'orderNumber', type: 'text', unique: true, admin: { readOnly: true } },
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'priceAtPurchase', type: 'number', required: true },  // snapshot price
      ],
    },
    { name: 'total', type: 'number', required: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        'pending', 'confirmed', 'shipped', 'delivered',
        'cancelled', 'refunded', 'returned',
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    { name: 'stripePaymentIntentID', type: 'text', admin: { readOnly: true } },
    { name: 'carbonOffset', type: 'checkbox', defaultValue: false },
    {
      name: 'ecoImpact',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'totalRecycledPercentage', type: 'number' },
        { name: 'totalCarbonSavedKg', type: 'number' },
        { name: 'plasticDivertedKg', type: 'number' },
      ],
    },
    { name: 'notes', type: 'textarea' },  // Admin notes
  ],
  hooks: {
    beforeChange: [
      // Auto-generate order number
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.orderNumber = `RH-${Date.now().toString(36).toUpperCase()}`
        }
        return data
      },
    ],
    afterChange: [
      // Decrease stock when order is confirmed
      async ({ doc, previousDoc, req }) => {
        if (doc.status === 'confirmed' && previousDoc?.status === 'pending') {
          for (const item of doc.items) {
            const productId = typeof item.product === 'string' ? item.product : item.product.id
            await req.payload.update({
              collection: 'products',
              id: productId,
              data: { stock: { decrement: item.quantity } },
            })
          }
        }
      },
    ],
  },
}
```

## Discounts & Promotions

### Discounts Collection

```typescript
// src/payload/collections/Discounts.ts
export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'isActive', 'usesRemaining'],
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'super-admin' || user?.role === 'admin',
    create: ({ req: { user } }) =>
      user?.role === 'super-admin' || user?.role === 'admin',
    update: ({ req: { user } }) =>
      user?.role === 'super-admin' || user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage Off', value: 'percentage' },
        { label: 'Fixed Amount Off', value: 'fixed' },
        { label: 'Free Shipping', value: 'free-shipping' },
      ],
    },
    { name: 'value', type: 'number', required: true },  // percentage (0-100) or cents
    { name: 'minimumOrder', type: 'number', defaultValue: 0 },  // in cents
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'usesRemaining', type: 'number' },  // null = unlimited
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    {
      name: 'appliesTo',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },  // empty = all products
  ],
}
```

### Discount Validation Endpoint

```typescript
// src/payload/endpoints/validateDiscount.ts
import type { PayloadHandler } from 'payload/config'

export const validateDiscount: PayloadHandler = async (req, res) => {
  const { code, cartTotal } = req.body

  const discounts = await req.payload.find({
    collection: 'discounts',
    where: {
      code: { equals: code },
      isActive: { equals: true },
    },
    limit: 1,
  })

  const discount = discounts.docs[0]

  if (!discount) {
    return res.status(404).json({ valid: false, message: 'Invalid discount code' })
  }

  const now = new Date()
  if (discount.validFrom && new Date(discount.validFrom) > now) {
    return res.status(400).json({ valid: false, message: 'Discount not yet active' })
  }
  if (discount.validUntil && new Date(discount.validUntil) < now) {
    return res.status(400).json({ valid: false, message: 'Discount has expired' })
  }
  if (discount.usesRemaining !== null && discount.usesRemaining <= 0) {
    return res.status(400).json({ valid: false, message: 'Discount fully redeemed' })
  }
  if (discount.minimumOrder && cartTotal < discount.minimumOrder) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order of $${(discount.minimumOrder / 100).toFixed(2)} required`,
    })
  }

  return res.json({
    valid: true,
    type: discount.type,
    value: discount.value,
  })
}
```

## Access Control Patterns

### Helper: Role-Based Access

```typescript
// src/payload/access/roles.ts
import type { Access } from 'payload/config'

export const isAdmin: Access = ({ req: { user } }) =>
  user?.role === 'super-admin' || user?.role === 'admin'

export const isSuperAdmin: Access = ({ req: { user } }) =>
  user?.role === 'super-admin'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.role === 'super-admin' || user?.role === 'admin') return true
  return { id: { equals: user?.id } }
}

export const isAdminOrOwner = (ownerField: string): Access => ({ req: { user } }) => {
  if (user?.role === 'super-admin' || user?.role === 'admin') return true
  return { [ownerField]: { equals: user?.id } }
}
```

## Custom Admin Endpoints

### Bulk Price Update

```typescript
// src/payload/endpoints/bulkPriceUpdate.ts
export const bulkPriceUpdate: PayloadHandler = async (req, res) => {
  const { productIds, adjustmentType, adjustmentValue } = req.body
  // adjustmentType: 'percentage' | 'fixed'
  // adjustmentValue: e.g., -10 for 10% off or -500 for $5.00 off

  const results = []
  for (const id of productIds) {
    const product = await req.payload.findByID({ collection: 'products', id })
    let newPrice = product.price

    if (adjustmentType === 'percentage') {
      newPrice = Math.round(product.price * (1 + adjustmentValue / 100))
    } else {
      newPrice = product.price + adjustmentValue
    }

    if (newPrice < 0) newPrice = 0

    const updated = await req.payload.update({
      collection: 'products',
      id,
      data: { price: newPrice },
    })
    results.push({ id, title: updated.title, oldPrice: product.price, newPrice })
  }

  return res.json({ updated: results.length, results })
}
```

### Inventory Report

```typescript
// src/payload/endpoints/inventoryReport.ts
export const inventoryReport: PayloadHandler = async (req, res) => {
  const products = await req.payload.find({
    collection: 'products',
    limit: 0,  // all products
    sort: 'stock',
  })

  const report = {
    totalProducts: products.totalDocs,
    outOfStock: products.docs.filter(p => p.stock === 0).length,
    lowStock: products.docs.filter(p => p.stock > 0 && p.stock <= 5).length,
    inStock: products.docs.filter(p => p.stock > 5).length,
    items: products.docs.map(p => ({
      id: p.id,
      title: p.title,
      stock: p.stock,
      price: p.price,
      status: p.stock === 0 ? 'out-of-stock' : p.stock <= 5 ? 'low-stock' : 'in-stock',
    })),
  }

  return res.json(report)
}
```

## Data Import/Export

### CSV Product Import

```typescript
// src/payload/endpoints/importProducts.ts
// Accepts CSV with columns: title, price, stock, category, recycledPercentage, materials
export const importProducts: PayloadHandler = async (req, res) => {
  // Parse CSV from request body (use a library like papaparse)
  const rows = parseCsv(req.body.csv)
  const results = { created: 0, errors: [] as string[] }

  for (const row of rows) {
    try {
      await req.payload.create({
        collection: 'products',
        data: {
          title: row.title,
          slug: slugify(row.title),
          price: Math.round(parseFloat(row.price) * 100),  // convert dollars to cents
          stock: parseInt(row.stock, 10),
          ecoData: {
            recycledPercentage: parseInt(row.recycledPercentage, 10) || 0,
            materials: row.materials
              ? row.materials.split(';').map((m: string) => ({ material: m.trim() }))
              : [],
          },
        },
      })
      results.created++
    } catch (err) {
      results.errors.push(`Row "${row.title}": ${err.message}`)
    }
  }

  return res.json(results)
}
```

## Admin Conventions

- All admin-only endpoints require `isAdmin` access check
- Price modifications always validate against `> 0` (no free products unless intentional)
- Order status changes follow the workflow diagram — no skipping steps
- Stock decrements happen on order **confirmation**, not creation (pending orders don't lock inventory)
- All bulk operations return a results summary with per-item status
- Audit-sensitive fields (`role`, `stripeCustomerID`, `stripeProductID`) are `admin: { readOnly: true }` for non-super-admins
