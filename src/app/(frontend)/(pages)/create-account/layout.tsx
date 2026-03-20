import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your RHEUSE account and start shopping sustainably.',
}

export default function CreateAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
