'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '@/app/_providers/Cart'
import { useAuth } from '@/app/_providers/Auth'
import { Input } from '@/app/_components/Input'
import { Price } from '@/app/_components/Price'
import { Button } from '@/app/_components/Button'
import { PaymentForm } from '@/app/_components/PaymentForm'
import stripePromise from '@/app/_utilities/getStripe'
import classes from './page.module.scss'

const CARBON_OFFSET_FEE = 199

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
  const [carbonOffset, setCarbonOffset] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')

  const orderTotal = carbonOffset ? total + CARBON_OFFSET_FEE : total

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Create payment intent when moving to payment step
  const proceedToPayment = useCallback(async () => {
    setError(null)

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          carbonOffset,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }, [cart.items, carbonOffset])

  // Re-create payment intent if carbon offset changes while on payment step
  useEffect(() => {
    if (step === 'payment') {
      setClientSecret(null)
      proceedToPayment()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carbonOffset])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    proceedToPayment()
  }

  const handlePaymentSuccess = useCallback(
    (paymentIntentId: string) => {
      clearCart()
      router.push(`/order-confirmation?pi=${paymentIntentId}`)
    },
    [clearCart, router],
  )

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

      <div className={classes.layout}>
        <div className={classes.form}>
          {/* Step 1: Shipping */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit}>
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

              {error && <p className={classes.error}>{error}</p>}

              <Button
                label="Continue to Payment"
                variant="filled"
                type="submit"
                className={classes.continueBtn}
              />
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div>
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className={classes.backBtn}
              >
                ← Back to Shipping
              </button>

              <section className={classes.section}>
                <h2 className={classes.sectionTitle}>Payment</h2>

                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#1F4D38',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '0px',
                        },
                      },
                    }}
                  >
                    <PaymentForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : (
                  <div className={classes.loading}>
                    Initializing secure payment…
                  </div>
                )}
              </section>

              {error && <p className={classes.error}>{error}</p>}
            </div>
          )}
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

          {/* Carbon-neutral shipping toggle */}
          <label className={classes.carbonToggle}>
            <input
              type="checkbox"
              checked={carbonOffset}
              onChange={(e) => setCarbonOffset(e.target.checked)}
              className={classes.carbonCheckbox}
            />
            <div className={classes.carbonInfo}>
              <span className={classes.carbonLabel}>
                🌱 Carbon-Neutral Shipping
              </span>
              <span className={classes.carbonDesc}>
                Offset your delivery&apos;s carbon footprint
              </span>
            </div>
            <Price amount={CARBON_OFFSET_FEE} />
          </label>

          <div className={classes.summaryTotal}>
            <span>Total</span>
            <Price amount={orderTotal} />
          </div>
        </aside>
      </div>
    </div>
  )
}
