import React from 'react'
import classes from './index.module.scss'

type OrderItemWithEco = {
  title: string
  quantity: number
  recycledPercentage?: number
  carbonSavedKg?: number
  certifications?: string[]
}

type Props = {
  items: OrderItemWithEco[]
  carbonOffset?: boolean
  className?: string
}

export const ImpactReceipt: React.FC<Props> = ({
  items,
  carbonOffset = false,
  className,
}) => {
  const totalRecycled = items.reduce((sum, item) => {
    return sum + (item.recycledPercentage || 0) * item.quantity
  }, 0)
  const avgRecycled = items.length > 0 ? Math.round(totalRecycled / items.reduce((s, i) => s + i.quantity, 0)) : 0

  const totalCarbon = items.reduce((sum, item) => {
    return sum + (item.carbonSavedKg || 0) * item.quantity
  }, 0)

  const allCerts = new Set<string>()
  items.forEach((item) => {
    item.certifications?.forEach((c) => allCerts.add(c))
  })

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className={`${classes.receipt} ${className || ''}`}>
      <div className={classes.header}>
        <span className={classes.label}>Your Eco Impact Receipt</span>
        <span className={classes.icon} aria-hidden="true">🌍</span>
      </div>

      <div className={classes.stats}>
        <div className={classes.stat}>
          <span className={classes.statValue}>{totalItems}</span>
          <span className={classes.statLabel}>Sustainable Items</span>
        </div>
        <div className={classes.stat}>
          <span className={classes.statValue}>{avgRecycled}%</span>
          <span className={classes.statLabel}>Avg. Recycled Content</span>
        </div>
        <div className={classes.stat}>
          <span className={classes.statValue}>{totalCarbon.toFixed(1)} kg</span>
          <span className={classes.statLabel}>CO₂ Saved</span>
        </div>
        {allCerts.size > 0 && (
          <div className={classes.stat}>
            <span className={classes.statValue}>{allCerts.size}</span>
            <span className={classes.statLabel}>Certifications</span>
          </div>
        )}
      </div>

      {carbonOffset && (
        <div className={classes.offset}>
          <span className={classes.offsetIcon} aria-hidden="true">🌿</span>
          <span>Carbon-neutral shipping included with this order</span>
        </div>
      )}

      <p className={classes.message}>
        By choosing RHEUSE, you&apos;ve directly contributed to reducing single-use
        plastic waste. Every item is crafted from sustainable materials and
        shipped in 100% compostable packaging.
      </p>
    </div>
  )
}
