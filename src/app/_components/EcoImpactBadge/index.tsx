import React from 'react'
import classes from './index.module.scss'

type Props = {
  percentage?: number
  carbonSaved?: number
  compact?: boolean
  className?: string
}

export const EcoImpactBadge: React.FC<Props> = ({
  percentage,
  carbonSaved,
  compact = false,
  className,
}) => {
  if (!percentage && !carbonSaved) return null

  return (
    <div
      className={`${classes.badge} ${compact ? classes.compact : ''} ${className || ''}`}
    >
      {percentage != null && percentage > 0 && (
        <span className={classes.metric}>
          <span className={classes.icon} aria-hidden="true">♻️</span>
          <span>{percentage}% recycled</span>
        </span>
      )}
      {carbonSaved != null && carbonSaved > 0 && (
        <span className={classes.metric}>
          <span className={classes.icon} aria-hidden="true">🌱</span>
          <span>{carbonSaved}kg CO₂ saved</span>
        </span>
      )}
    </div>
  )
}
