import React from 'react'
import Link from 'next/link'
import { Media } from '../Media'
import { Price } from '../Price'
import { EcoImpactBadge } from '../EcoImpactBadge'
import classes from './index.module.scss'

type ProductCardData = {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: { image: { url?: string; alt?: string; width?: number; height?: number } }[]
  categories?: ({ title: string } | string)[]
  ecoData?: {
    recycledPercentage?: number
    carbonSavedKg?: number
    certifications?: string[]
  }
}

type Props = {
  product: ProductCardData
  className?: string
}

export const Card: React.FC<Props> = ({ product, className }) => {
  const { title, slug, images, price, compareAtPrice, ecoData, categories } = product
  const category = categories?.[0]
  const categoryLabel = category
    ? typeof category === 'string'
      ? category
      : category.title
    : null

  return (
    <Link
      href={`/products/${slug}`}
      className={`${classes.card} ${className || ''}`}
    >
      <div className={classes.imageWrapper}>
        {images?.[0]?.image && (
          <Media resource={images[0].image} fill sizes="(max-width: 768px) 100vw, 33vw" />
        )}
        {ecoData?.recycledPercentage && ecoData.recycledPercentage > 0 && (
          <EcoImpactBadge
            percentage={ecoData.recycledPercentage}
            compact
            className={classes.ecoBadge}
          />
        )}
      </div>
      <div className={classes.content}>
        {categoryLabel && (
          <span className={classes.category}>{categoryLabel}</span>
        )}
        <h3 className={classes.title}>{title}</h3>
        <Price amount={price} compareAt={compareAtPrice} />
      </div>
    </Link>
  )
}
