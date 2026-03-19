import React from 'react'
import Link from 'next/link'
import { Price } from '@/app/_components/Price'
import { Button } from '@/app/_components/Button'
import { ImpactReceipt } from '@/app/_components/ImpactReceipt'
import classes from './page.module.scss'

type OrderItem = {
  product:
    | {
        title: string
        ecoData?: {
          recycledPercentage?: number
          carbonSavedKg?: number
          certifications?: string[]
        }
      }
    | string
  quantity: number
  price: number
}

type Order = {
  id: string
  orderNumber?: string
  total: number
  items: OrderItem[]
  carbonOffset?: boolean
  createdAt: string
}

async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}?depth=1`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getOrderByPaymentIntent(pi: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/orders?where[stripePaymentIntentID][equals]=${encodeURIComponent(pi)}&depth=1&limit=1`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] || null
  } catch {
    return null
  }
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; pi?: string }>
}) {
  const { id, pi } = await searchParams

  let order: Order | null = null
  if (id) {
    order = await getOrder(id)
  } else if (pi) {
    order = await getOrderByPaymentIntent(pi)
  }

  if (!order) {
    return (
      <div className={classes.page}>
        <div className={classes.empty}>
          <h1 className={classes.heading}>Order Not Found</h1>
          <p>We couldn&apos;t locate that order. Please check your email for confirmation.</p>
          <Button label="Return Home" href="/" variant="filled" />
        </div>
      </div>
    )
  }

  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <span className={classes.checkmark} aria-hidden="true">✓</span>
        <h1 className={classes.heading}>Thank You for Your Order</h1>
        <p className={classes.subtitle}>
          Order <strong>{order.orderNumber || order.id}</strong> has been placed
          successfully.
        </p>
      </div>

      <div className={classes.card}>
        <h2 className={classes.cardTitle}>Order Details</h2>

        <div className={classes.items}>
          {order.items.map((item, idx) => {
            const title =
              typeof item.product === 'string'
                ? item.product
                : item.product.title

            return (
              <div key={idx} className={classes.item}>
                <div className={classes.itemInfo}>
                  <span className={classes.itemName}>{title}</span>
                  <span className={classes.itemQty}>× {item.quantity}</span>
                </div>
                <Price amount={item.price * item.quantity} />
              </div>
            )
          })}
        </div>

        <div className={classes.total}>
          <span>Total</span>
          <Price amount={order.total} />
        </div>
      </div>

      <ImpactReceipt
        items={order.items.map((item) => {
          const prod = typeof item.product === 'string' ? null : item.product
          return {
            title: prod?.title || (typeof item.product === 'string' ? item.product : ''),
            quantity: item.quantity,
            recycledPercentage: prod?.ecoData?.recycledPercentage,
            carbonSavedKg: prod?.ecoData?.carbonSavedKg,
            certifications: prod?.ecoData?.certifications,
          }
        })}
        carbonOffset={order.carbonOffset}
      />

      <div className={classes.actions}>
        <Button label="Continue Shopping" href="/products" variant="filled" />
        <Link href="/orders" className={classes.link}>
          View All Orders
        </Link>
      </div>
    </div>
  )
}
