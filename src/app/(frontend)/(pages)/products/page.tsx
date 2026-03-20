import React from 'react'
import type { Metadata } from 'next'
import { Card } from '@/app/_components/Card'
import classes from './page.module.scss'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description:
    'Browse our full collection of sustainable, eco-friendly utensils and kitchenware. Made from recycled and natural materials, zero single-use plastic.',
  openGraph: {
    title: 'Shop All Eco-Friendly Products | RHEUSE',
    description:
      'Browse our full collection of sustainable, eco-friendly utensils and kitchenware.',
    type: 'website',
  },
}

// TODO: Replace with Payload CMS query in production
async function getProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products?limit=24&depth=1`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <span className={classes.label}>The Collection</span>
        <h1 className={classes.heading}>All Products</h1>
        <p className={classes.description}>
          Thoughtfully designed, sustainably crafted essentials for conscious
          living.
        </p>
      </div>

      {products.length > 0 ? (
        <div className={classes.grid}>
          {products.map((product: Record<string, unknown>) => (
            <Card
              key={product.id as string}
              product={product as Parameters<typeof Card>[0]['product']}
            />
          ))}
        </div>
      ) : (
        <div className={classes.empty}>
          <p>No products available yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
