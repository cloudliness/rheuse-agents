import { NextResponse } from 'next/server'
import { stripe, CARBON_OFFSET_FEE } from '@/app/_utilities/stripe'

type CartItemPayload = {
  productId: string
  quantity: number
}

export async function POST(req: Request) {
  try {
    const { items, carbonOffset } = (await req.json()) as {
      items: CartItemPayload[]
      carbonOffset?: boolean
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Fetch real prices from Payload (never trust client prices)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    let total = 0

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Invalid item in cart' },
          { status: 400 },
        )
      }

      const res = await fetch(`${appUrl}/api/products/${item.productId}?depth=0`)
      if (!res.ok) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 },
        )
      }

      const product = await res.json()

      if (product.stock !== undefined && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `"${product.title}" has insufficient stock` },
          { status: 400 },
        )
      }

      total += product.price * item.quantity
    }

    if (carbonOffset) {
      total += CARBON_OFFSET_FEE
    }

    if (total < 50) {
      return NextResponse.json(
        { error: 'Order total is too low for payment processing' },
        { status: 400 },
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        cartItems: JSON.stringify(
          items.map((i) => ({ id: i.productId, qty: i.quantity })),
        ),
        carbonOffset: carbonOffset ? 'true' : 'false',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: total,
    })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 },
    )
  }
}
