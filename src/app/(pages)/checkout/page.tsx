'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/_providers/Cart'
import { useAuth } from '@/app/_providers/Auth'
import { Input } from '@/app/_components/Input'
import { Price } from '@/app/_components/Price'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

export default function CheckoutPage() {
  const { cart, total, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            product: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          total,
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          customerEmail: form.email,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.errors?.[0]?.message || 'Order could not be placed')
      }

      const data = await res.json()
      clearCart()
      router.push(`/order-confirmation?id=${data.doc.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (itemCount === 0) {
    return (
      <div className={classes.page}>
        <div className={classes.empty}>
          <h1 className={classes.heading}>Checkout</h1>
          <p>Your cart is empty. Add some items before checking out.</p>
          <Button label="Shop the Collection" href="/products" variant="filled" />
        </div>
      </div>
    )
  }

  return (
    <div className={classes.page}>
      <h1 className={classes.heading}>Checkout</h1>

      <form onSubmit={handleSubmit} className={classes.layout}>
        <div className={classes.form}>
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Contact</h2>
            <Input
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </section>

          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Shipping Address</h2>
            <div className={classes.row}>
              <Input
                name="firstName"
                label="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              name="address"
              label="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <div className={classes.row}>
              <Input
                name="city"
                label="City"
                value={form.city}
                onChange={handleChange}
                required
              />
              <Input
                name="state"
                label="State"
                value={form.state}
                onChange={handleChange}
                required
              />
              <Input
                name="zip"
                label="ZIP"
                value={form.zip}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Payment</h2>
            <div className={classes.paymentPlaceholder}>
              <p>Stripe integration coming in Phase 6.</p>
              <p className={classes.paymentNote}>
                Orders are currently placed without payment processing.
              </p>
            </div>
          </section>

          {error && <p className={classes.error}>{error}</p>}
        </div>

        <aside className={classes.summary}>
          <h2 className={classes.summaryTitle}>Order Review</h2>

          <div className={classes.summaryItems}>
            {cart.items.map((item) => (
              <div key={item.product.id} className={classes.summaryItem}>
                <div className={classes.summaryItemInfo}>
                  <span className={classes.summaryItemName}>
                    {item.product.title}
                  </span>
                  <span className={classes.summaryItemQty}>
                    × {item.quantity}
                  </span>
                </div>
                <Price amount={item.product.price * item.quantity} />
              </div>
            ))}
          </div>

          <div className={classes.summaryRow}>
            <span>Subtotal</span>
            <Price amount={total} />
          </div>
          <div className={classes.summaryRow}>
            <span>Shipping</span>
            <span className={classes.summaryNote}>Calculated next</span>
          </div>
          <div className={classes.summaryTotal}>
            <span>Total</span>
            <Price amount={total} />
          </div>

          <Button
            label={submitting ? 'Placing Order…' : 'Place Order'}
            variant="filled"
            className={classes.placeOrder}
            type="submit"
          />
        </aside>
      </form>
    </div>
  )
}
