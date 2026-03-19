import React from 'react'
import classes from './index.module.scss'

type Props = {
  recycledPercentage?: number
  carbonSavedKg?: number
  certificationCount?: number
  className?: string
}

function computeScore(
  recycled?: number,
  carbon?: number,
  certs?: number,
): number {
  let score = 0

  // Recycled content: up to 40 points
  if (recycled != null) score += Math.min(40, recycled * 0.4)

  // Carbon savings: up to 30 points (capped at 10kg = full marks)
  if (carbon != null) score += Math.min(30, (carbon / 10) * 30)

  // Certifications: 10 points each, up to 30
  if (certs != null) score += Math.min(30, certs * 10)

  return Math.round(Math.min(100, score))
}

function scoreToLeaves(score: number): number {
  if (score >= 80) return 5
  if (score >= 60) return 4
  if (score >= 40) return 3
  if (score >= 20) return 2
  return 1
}

function scoreLabel(leaves: number): string {
  if (leaves === 5) return 'Exceptional'
  if (leaves === 4) return 'Excellent'
  if (leaves === 3) return 'Good'
  if (leaves === 2) return 'Fair'
  return 'Starter'
}

export const EcoScore: React.FC<Props> = ({
  recycledPercentage,
  carbonSavedKg,
  certificationCount,
  className,
}) => {
  const score = computeScore(recycledPercentage, carbonSavedKg, certificationCount)
  const leaves = scoreToLeaves(score)
  const label = scoreLabel(leaves)

  return (
    <div className={`${classes.score} ${className || ''}`}>
      <div className={classes.leaves} aria-label={`Eco score: ${leaves} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${classes.leaf} ${i < leaves ? classes.active : ''}`}
            aria-hidden="true"
          >
            🍃
          </span>
        ))}
      </div>
      <span className={classes.label}>{label} Eco Score</span>
    </div>
  )
}
