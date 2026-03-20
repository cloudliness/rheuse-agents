import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your RHEUSE account to manage orders and preferences.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
