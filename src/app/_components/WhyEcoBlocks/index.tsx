import React from 'react'
import classes from './index.module.scss'

type WhyEcoItem = {
  icon: string
  title: string
  description: string
}

type Props = {
  items?: WhyEcoItem[]
  className?: string
}

const defaultItems: WhyEcoItem[] = [
  {
    icon: '🌿',
    title: 'Sustainably Sourced',
    description:
      'Every material is traced back to responsible origins — from FSC-certified bamboo to recycled stainless steel.',
  },
  {
    icon: '🏭',
    title: 'Low-Impact Manufacturing',
    description:
      'Our production partners use renewable energy and closed-loop water systems, minimizing environmental footprint.',
  },
  {
    icon: '📦',
    title: 'Zero-Plastic Packaging',
    description:
      'Every order ships in 100% compostable, plastic-free packaging. Even our tape is made from plant-based adhesive.',
  },
  {
    icon: '♻️',
    title: 'Circular by Design',
    description:
      'Products are designed for longevity. When they reach end-of-life, send them back — we\'ll recycle or refurbish them.',
  },
]

export const WhyEcoBlocks: React.FC<Props> = ({
  items = defaultItems,
  className,
}) => {
  return (
    <section className={`${classes.section} ${className || ''}`}>
      <div className={classes.inner}>
        <span className={classes.label}>Why Eco Matters</span>
        <h2 className={classes.heading}>
          The <em>Conscious</em> Difference
        </h2>

        <div className={classes.grid}>
          {items.map((item) => (
            <div key={item.title} className={classes.block}>
              <span className={classes.icon} aria-hidden="true">
                {item.icon}
              </span>
              <h3 className={classes.blockTitle}>{item.title}</h3>
              <p className={classes.blockDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
