import React from 'react'
import Link from 'next/link'
import { Media } from '../Media'
import classes from './index.module.scss'

type CategoryItem = {
  title: string
  slug: string
  description?: string
  image?: { url?: string; alt?: string; width?: number; height?: number }
}

type Props = {
  label?: string
  heading?: string
  categories: CategoryItem[]
  viewAllHref?: string
}

export const Categories: React.FC<Props> = ({
  label = 'Curated Selections',
  heading = 'Featured Collections',
  categories,
  viewAllHref,
}) => {
  if (!categories?.length) return null

  return (
    <section className={classes.section}>
      <div className={classes.header}>
        <div>
          {label && <span className={classes.label}>{label}</span>}
          {heading && <h2 className={classes.heading}>{heading}</h2>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className={classes.viewAll}>
            View All Series
          </Link>
        )}
      </div>

      <div className={classes.grid}>
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`${classes.card} ${i === categories.length - 1 && categories.length % 2 !== 0 ? classes.wide : ''}`}
          >
            <div className={classes.imageWrapper}>
              {cat.image && (
                <Media resource={cat.image} fill sizes="(max-width: 768px) 100vw, 50vw" />
              )}
              <div className={classes.overlay} />
            </div>
            <div className={classes.cardContent}>
              <h3 className={classes.cardTitle}>{cat.title}</h3>
              {cat.description && (
                <p className={classes.cardDesc}>{cat.description}</p>
              )}
              <span className={classes.cta}>Explore Series</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
