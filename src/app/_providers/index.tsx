'use client'

import React from 'react'
import { CartProvider } from './Cart'
import { AuthProvider } from './Auth'

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
