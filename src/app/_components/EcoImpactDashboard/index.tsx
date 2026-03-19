import React from 'react'
import classes from './index.module.scss'

type Stat = {
  icon: string
  value: string
  label: string
}

type Props = {
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  { icon: '♻️', value: '12,400+', label: 'Products Reused' },
  { icon: '🌱', value: '8.2 tons', label: 'CO₂ Saved' },
  { icon: '🌊', value: '3,600 kg', label: 'Plastic Diverted' },
  { icon: '🌍', value: '40+', label: 'Countries Reached' },
]

export const EcoImpactDashboard: React.FC<Props> = ({
  stats = defaultStats,
}) => {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <span className={classes.label}>Our Collective Impact</span>
        <h2 className={classes.heading}>
          Together, We&apos;re <em>Reshaping</em> the Future
        </h2>
        <p className={classes.description}>
          Every RHEUSE product you choose contributes to a growing movement
          against single-use waste. Here&apos;s what our community has achieved
          so far.
        </p>

        <div className={classes.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={classes.stat}>
              <span className={classes.statIcon} aria-hidden="true">
                {stat.icon}
              </span>
              <span className={classes.statValue}>{stat.value}</span>
              <span className={classes.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
