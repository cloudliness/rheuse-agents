'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/app/_providers/Cart'
import { Media } from '@/app/_components/Media'
import { Price } from '@/app/_components/Price'
import { QuantityStepper } from '@/app/_components/QuantityStepper'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, total, itemCount } = useCart()

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <h1 className={classes.heading}>Your Cart</h1>
        <p className={classes.subtitle}>
          Curating a conscious collection for your home.
        </p>
      </div>

      {itemCount === 0 ? (
        <div className={classes.empty}>
          <p>Your cart is empty.</p>
          <Button label="Shop the Collection" href="/products" variant="filled" />
        </div>
      ) : (
        <div className={classes.layout}>
          <div className={classes.items}>
            {cart.items.map((item) => {
              const category = item.product.categories?.[0]
              const categoryLabel = category
                ? typeof category === 'string'
                  ? category
                  : category.title
                : null

              return (
                <div key={item.product.id} className={classes.item}>
                  <div className={classes.itemImage}>
                    {item.product.images?.[0]?.image && (
                      <Media
                        resource={item.product.images[0].image}
                        fill
                        sizes="100px"
                      />
                    )}
                  </div>

                  <div className={classes.itemDetails}>
                    {categoryLabel && (
                      <span className={classes.itemCategory}>
                        {categoryLabel}
                      </span>
                    )}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className={classes.itemTitle}
                    >
                      {item.product.title}
                    </Link>

                    <div className={classes.itemActions}>
                      <QuantityStepper
                        quantity={item.quantity}
                        onChange={(qty) =>
                          updateQuantity(item.product.id, qty)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className={classes.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <Price
                    amount={item.product.price * item.quantity}
                    className={classes.itemPrice}
                  />
                </div>
              )
            })}

            <div className={classes.delivery}>
              <span className={classes.deliveryIcon} aria-hidden="true">
                🌿
              </span>
              <div>
                <h4 className={classes.deliveryTitle}>Conscious Delivery</h4>
                <p className={classes.deliveryText}>
                  Your items will be shipped in 100% plastic-free, compostable
                  packaging. We partner with carbon-neutral carriers to ensure
                  your footprint remains light.
                </p>
              </div>
            </div>
          </div>

          <aside className={classes.summary}>
            <h2 className={classes.summaryTitle}>Order Summary</h2>

            <div className={classes.summaryRow}>
              <span>Subtotal</span>
              <Price amount={total} />
            </div>
            <div className={classes.summaryRow}>
              <span>Carbon-Neutral Shipping</span>
              <span className={classes.summaryNote}>
                Calculated at checkout
              </span>
            </div>

            <div className={classes.summaryTotal}>
              <span>Total</span>
              <div className={classes.totalAmount}>
                <Price amount={total} />
                <span className={classes.currency}>Prices in USD</span>
              </div>
            </div>

            <Button
              label="Proceed to Checkout"
              href="/checkout"
              variant="filled"
              className={classes.checkoutBtn}
            />

            <p className={classes.secure}>Secure SSL Encrypted Payment</p>

            <div className={classes.trust}>
              <div className={classes.trustItem}>
                <span aria-hidden="true">✓</span>
                30-Day Circular Returns Policy
              </div>
              <div className={classes.trustItem}>
                <span aria-hidden="true">♻️</span>
                Zero-Plastic Packaging Guaranteed
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
