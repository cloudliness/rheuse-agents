'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/_providers/Auth'
import { Price } from '@/app/_components/Price'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

type OrderSummary = {
  id: string
  orderNumber?: string
  total: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?depth=0&sort=-createdAt', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(data.docs || [])
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className={classes.page}>
        <p className={classes.loading}>Loading…</p>
      </div>
    )
  }

  return (
    <div className={classes.page}>
      <h1 className={classes.heading}>Order History</h1>

      {orders.length === 0 ? (
        <div className={classes.empty}>
          <p>You haven&apos;t placed any orders yet.</p>
          <Button label="Shop the Collection" href="/products" variant="filled" />
        </div>
      ) : (
        <div className={classes.list}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-confirmation?id=${order.id}`}
              className={classes.order}
            >
              <div className={classes.orderHeader}>
                <span className={classes.orderNumber}>
                  {order.orderNumber || order.id}
                </span>
                <span className={classes.orderStatus}>{order.status}</span>
              </div>
              <div className={classes.orderFooter}>
                <span className={classes.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <Price amount={order.total} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
