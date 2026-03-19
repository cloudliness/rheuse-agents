import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Order History',
  robots: { index: false, follow: false },
}

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
