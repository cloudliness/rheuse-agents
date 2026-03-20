import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Media } from '@/app/_components/Media'
import { Price } from '@/app/_components/Price'
import { EcoImpactBadge } from '@/app/_components/EcoImpactBadge'
import { EcoScore } from '@/app/_components/EcoScore'
import { CertificationBadges } from '@/app/_components/CertificationBadges'
import { ProductActions } from './ProductActions'
import classes from './page.module.scss'

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(
      `${baseUrl}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] || null
  } catch {
    return null
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return { title: 'Product Not Found' }

  const firstImage = product.images?.[0]?.image
  const ogImages = firstImage?.url
    ? [{ url: firstImage.url, alt: product.title }]
    : undefined

  const description =
    product.ecoData?.ecoStatement ||
    `Shop ${product.title} — made from ${product.ecoData?.recycledPercentage ?? 0}% recycled materials. Sustainably crafted at RHEUSE.`

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      type: 'website',
      images: ogImages,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return notFound()

  const {
    title,
    images,
    price,
    compareAtPrice,
    description,
    ecoData,
    categories,
    stock,
  } = product

  const categoryLabel = categories?.[0]
    ? typeof categories[0] === 'string'
      ? categories[0]
      : categories[0].title
    : null

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rheuse.com'
  const firstImage = images?.[0]?.image

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: title,
        description: ecoData?.ecoStatement ?? title,
        image: firstImage?.url ? [firstImage.url] : undefined,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'RHEUSE' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: (price / 100).toFixed(2),
          availability:
            stock == null || stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: `${appUrl}/products/${product.slug}`,
          seller: { '@type': 'Organization', name: 'RHEUSE' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: appUrl },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${appUrl}/products` },
          { '@type': 'ListItem', position: 3, name: title, item: `${appUrl}/products/${product.slug}` },
        ],
      },
    ],
  }

  return (
    <div className={classes.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className={classes.gallery}>
        {images?.length > 0 ? (
          images.map(
            (
              img: { image: { url?: string; alt?: string; width?: number; height?: number } },
              i: number,
            ) => (
              <div key={i} className={classes.imageWrapper}>
                <Media
                  resource={img.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                />
              </div>
            ),
          )
        ) : (
          <div className={classes.imagePlaceholder} />
        )}
      </div>

      <div className={classes.details}>
        {categoryLabel && (
          <span className={classes.category}>{categoryLabel}</span>
        )}
        <h1 className={classes.title}>{title}</h1>
        <Price
          amount={price}
          compareAt={compareAtPrice}
          className={classes.price}
        />

        {ecoData && (
          <EcoImpactBadge
            percentage={ecoData.recycledPercentage}
            carbonSaved={ecoData.carbonSavedKg}
            className={classes.ecoBadge}
          />
        )}

        {ecoData && (
          <EcoScore
            recycledPercentage={ecoData.recycledPercentage}
            carbonSavedKg={ecoData.carbonSavedKg}
            certificationCount={ecoData.certifications?.length}
          />
        )}

        <Suspense fallback={<div style={{ height: '3.5rem' }} aria-hidden="true" />}>
          <ProductActions product={product} />
        </Suspense>

        {stock != null && stock <= 0 && (
          <p className={classes.outOfStock}>Currently out of stock</p>
        )}

        {description && (
          <div className={classes.description}>
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              <p>{ecoData?.ecoStatement || ''}</p>
            )}
          </div>
        )}

        {ecoData?.materials?.length > 0 && (
          <div className={classes.materials}>
            <h3 className={classes.sectionLabel}>Materials</h3>
            <ul className={classes.materialList}>
              {ecoData.materials.map(
                (m: { material: string }, i: number) => (
                  <li key={i}>{m.material}</li>
                ),
              )}
            </ul>
          </div>
        )}

        {ecoData?.certifications?.length > 0 && (
          <div className={classes.certifications}>
            <h3 className={classes.sectionLabel}>Certifications</h3>
            <CertificationBadges
              certifications={ecoData.certifications}
              layout="inline"
            />
          </div>
        )}
      </div>
    </div>
  )
}
