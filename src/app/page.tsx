import React from 'react'
import type { Metadata } from 'next'
import { Hero } from './_components/Hero'
import { EcoImpactDashboard } from './_components/EcoImpactDashboard'
import { Categories } from './_components/Categories'
import { MissionSection } from './_components/MissionSection'
import { WhyEcoBlocks } from './_components/WhyEcoBlocks'
import { RefillReturnCTA } from './_components/RefillReturnCTA'
import { Newsletter } from './_components/Newsletter'
import classes from './page.module.scss'

export const metadata: Metadata = {
  title: 'RHEUSE — Reuse. Reimagine. Reshape the future.',
  description:
    'Shop sustainable, eco-friendly utensil sets and kitchenware — made from recycled and natural materials. Zero single-use plastic.',
  openGraph: {
    title: 'RHEUSE — Reuse. Reimagine. Reshape the future.',
    description:
      'Shop sustainable, eco-friendly utensil sets and kitchenware — made from recycled and natural materials.',
    type: 'website',
    siteName: 'RHEUSE',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com'}/#website`,
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com',
      name: 'RHEUSE',
      description: 'Sustainable, eco-friendly products for environmentally-conscious living',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com'}/products?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com'}/#organization`,
      name: 'RHEUSE',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com',
      description:
        'Making sustainable living accessible through beautifully designed, eco-friendly products',
    },
  ],
}

// TODO: Replace with Payload CMS data fetching in later phase
const placeholderCategories = [
  {
    title: 'Bamboo Sets',
    slug: 'bamboo-sets',
    description: 'Organic warmth meeting modern geometry.',
    image: undefined,
  },
  {
    title: 'Stainless Steel',
    slug: 'stainless-steel',
    description: 'Industrial durability, refined finish.',
    image: undefined,
  },
  {
    title: 'Travel Kits',
    slug: 'travel-kits',
    description: 'Comprehensive solutions for the global nomad.',
    image: undefined,
  },
]

export default function HomePage() {
  return (
    <div className={classes.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero
        label="The Modern Essential"
        heading="Elevated Utility for"
        headingAccent="Conscious Living"
        description="Our portable utensil sets combine architectural precision with sustainable materials, designed to accompany you through every meal, anywhere in the world."
        primaryCta={{ label: 'Shop the Collection', href: '/products' }}
        secondaryCta={{ label: 'Our Philosophy', href: '/about' }}
      />

      <MissionSection />

      <EcoImpactDashboard />

      <Categories
        label="Curated Selections"
        heading="Featured Collections"
        categories={placeholderCategories}
        viewAllHref="/products"
      />

      <WhyEcoBlocks />

      <RefillReturnCTA />

      <Newsletter />
    </div>
  )
}
