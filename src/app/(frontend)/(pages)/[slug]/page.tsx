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
  meta?: {
    title?: string
    description?: string
    image?: { url?: string; alt?: string }
  }
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

  if (!page) return { title: 'Page Not Found' }

  const ogImages = page.meta?.image?.url
    ? [{ url: page.meta.image.url, alt: page.meta.title || page.title }]
    : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      type: 'website' as const,
      images: ogImages,
    },
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com'

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: page!.meta?.title || page!.title,
        description: page!.meta?.description,
        url: `${appUrl}/${page!.slug}`,
        isPartOf: { '@id': `${appUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: appUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: page!.title,
            item: `${appUrl}/${page!.slug}`,
          },
        ],
      },
    ],
  }

  return (
    <article className={classes.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
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
