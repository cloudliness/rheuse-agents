import React from 'react'
import classes from './index.module.scss'

const certMeta: Record<string, { icon: string; label: string; color: string }> = {
  'fair-trade':       { icon: '🤝', label: 'Fair Trade',       color: '#2D6A4F' },
  'organic':          { icon: '🌿', label: 'Organic',          color: '#40916C' },
  'b-corp':           { icon: '🅱️', label: 'B Corp',           color: '#1B4332' },
  'carbon-neutral':   { icon: '🌍', label: 'Carbon Neutral',   color: '#52B788' },
  'fsc':              { icon: '🌲', label: 'FSC Certified',    color: '#2D6A4F' },
  'cradle-to-cradle': { icon: '♻️', label: 'Cradle to Cradle', color: '#D4A373' },
  'gots':             { icon: '🧵', label: 'GOTS',             color: '#6C757D' },
  'oeko-tex':         { icon: '✅', label: 'OEKO-TEX',         color: '#40916C' },
}

type Props = {
  certifications: string[]
  layout?: 'inline' | 'grid'
  className?: string
}

export const CertificationBadges: React.FC<Props> = ({
  certifications,
  layout = 'inline',
  className,
}) => {
  if (!certifications || certifications.length === 0) return null

  return (
    <div
      className={`${classes.badges} ${classes[layout]} ${className || ''}`}
    >
      {certifications.map((cert) => {
        const meta = certMeta[cert] || {
          icon: '🏷️',
          label: cert.replace(/-/g, ' '),
          color: '#6C757D',
        }

        return (
          <div
            key={cert}
            className={classes.badge}
            style={{ '--badge-color': meta.color } as React.CSSProperties}
          >
            <span className={classes.icon} aria-hidden="true">
              {meta.icon}
            </span>
            <span className={classes.label}>{meta.label}</span>
          </div>
        )
      })}
    </div>
  )
}
