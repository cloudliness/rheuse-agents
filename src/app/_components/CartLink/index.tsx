'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '../../_providers/Cart'
import classes from './index.module.scss'

export const CartLink: React.FC = () => {
  const { itemCount } = useCart()

  return (
    <Link href="/cart" className={classes.cartLink} aria-label={`Cart (${itemCount} items)`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {itemCount > 0 && (
        <span className={classes.badge}>{itemCount}</span>
      )}
    </Link>
  )
}
