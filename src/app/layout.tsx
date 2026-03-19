import React from 'react'
import type { Metadata } from 'next'
import { Playfair_Display, Inter, DM_Sans } from 'next/font/google'
import '@/app/_css/globals.scss'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-accent',
})

export const metadata: Metadata = {
  title: {
    default: 'RHEUSE — Reuse. Reimagine. Reshape the future.',
    template: '%s | RHEUSE',
  },
  description:
    'Shop sustainable, eco-friendly products at RHEUSE. Reusable, recycled, and responsibly made goods for environmentally-conscious living.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
