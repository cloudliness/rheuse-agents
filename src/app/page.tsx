import React from 'react'
import { Hero } from './_components/Hero'
import { Categories } from './_components/Categories'
import { MissionSection } from './_components/MissionSection'
import { Newsletter } from './_components/Newsletter'
import classes from './page.module.scss'

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
      <Hero
        label="The Modern Essential"
        heading="Elevated Utility for"
        headingAccent="Conscious Living"
        description="Our portable utensil sets combine architectural precision with sustainable materials, designed to accompany you through every meal, anywhere in the world."
        primaryCta={{ label: 'Shop the Collection', href: '/products' }}
        secondaryCta={{ label: 'Our Philosophy', href: '/about' }}
      />

      <MissionSection />

      <Categories
        label="Curated Selections"
        heading="Featured Collections"
        categories={placeholderCategories}
        viewAllHref="/products"
      />

      <Newsletter />
    </div>
  )
}
