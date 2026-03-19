import { NextResponse } from 'next/server'
import { stripe } from '@/app/_utilities/stripe'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOKS_SIGNING_SECRET

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error('[stripe-webhooks] STRIPE_WEBHOOKS_SIGNING_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhooks] Signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn(
        `[stripe-webhooks] Payment failed: ${paymentIntent.id}`,
        paymentIntent.last_payment_error?.message,
      )
      break
    }

    default:
      // Unhandled event type — acknowledge receipt
      break
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Parse cart items and carbon offset from metadata
  const cartItems = JSON.parse(paymentIntent.metadata.cartItems || '[]') as {
    id: string
    qty: number
  }[]
  const carbonOffset = paymentIntent.metadata.carbonOffset === 'true'

  if (cartItems.length === 0) {
    console.error('[stripe-webhooks] No cart items in payment intent metadata')
    return
  }

  // Fetch product prices for the order record
  const orderItems = []
  for (const item of cartItems) {
    const res = await fetch(`${appUrl}/api/products/${item.id}?depth=0`)
    if (!res.ok) continue
    const product = await res.json()
    orderItems.push({
      product: item.id,
      quantity: item.qty,
      priceAtPurchase: product.price,
    })
  }

  // Build shipping address from payment intent shipping if available
  const shipping = paymentIntent.shipping
  const shippingAddress = shipping?.address
    ? {
        line1: shipping.address.line1 || '',
        line2: shipping.address.line2 || '',
        city: shipping.address.city || '',
        state: shipping.address.state || '',
        postalCode: shipping.address.postal_code || '',
        country: shipping.address.country || '',
      }
    : {
        line1: '',
        city: '',
        postalCode: '',
        country: 'US',
      }

  // Create the order via Payload REST API
  const orderRes = await fetch(`${appUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: orderItems,
      total: paymentIntent.amount,
      status: 'confirmed',
      stripePaymentIntentID: paymentIntent.id,
      carbonOffset,
      shippingAddress,
      // Customer will be linked if they were authenticated; otherwise the hook
      // will use the email from the payment intent for guest orders.
      customerEmail: paymentIntent.receipt_email || paymentIntent.metadata.email,
    }),
  })

  if (!orderRes.ok) {
    const errData = await orderRes.json().catch(() => ({}))
    console.error('[stripe-webhooks] Failed to create order:', errData)
  } else {
    const order = await orderRes.json()
    console.log(`[stripe-webhooks] Order created: ${order.doc?.orderNumber || order.doc?.id}`)
  }
}
