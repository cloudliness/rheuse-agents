import React from 'react'
import { notFound } from 'next/navigation'
import { Media } from '@/app/_components/Media'
import { Price } from '@/app/_components/Price'
import { EcoImpactBadge } from '@/app/_components/EcoImpactBadge'
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

  return (
    <div className={classes.page}>
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

        <ProductActions product={product} />

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
            <div className={classes.certList}>
              {ecoData.certifications.map((cert: string) => (
                <span key={cert} className={classes.certBadge}>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
