import React from 'react'
import { notFound } from 'next/navigation'
import { RichText } from '@/app/_components/RichText'
import { Hero } from '@/app/_components/Hero'
import classes from './page.module.scss'

type Page = {
  id: string
  title: string
  slug: string
  hero?: {
    heading?: string
    description?: string
    image?: { url?: string; alt?: string }
  }
  content?: Record<string, unknown>
}

async function getPage(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)

  return {
    title: page?.title || 'Page Not Found',
  }
}

export default async function CMSPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  return (
    <article className={classes.page}>
      {page.hero?.heading ? (
        <Hero
          heading={page.hero.heading}
          description={page.hero.description}
        />
      ) : (
        <header className={classes.header}>
          <h1 className={classes.heading}>{page.title}</h1>
        </header>
      )}

      {page.content && (
        <div className={classes.content}>
          <RichText content={page.content} />
        </div>
      )}
    </article>
  )
}
