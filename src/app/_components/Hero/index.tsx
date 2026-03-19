import React from 'react'
import { Button } from '../Button'
import classes from './index.module.scss'

type Props = {
  label?: string
  heading: string
  headingAccent?: string
  description?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  backgroundImage?: string
}

export const Hero: React.FC<Props> = ({
  label,
  heading,
  headingAccent,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
}) => {
  return (
    <section
      className={classes.hero}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className={classes.overlay} />
      <div className={classes.content}>
        {label && <span className={classes.label}>{label}</span>}
        <h1 className={classes.heading}>
          {heading}
          {headingAccent && (
            <>
              <br />
              <em className={classes.accent}>{headingAccent}</em>
            </>
          )}
        </h1>
        {description && <p className={classes.description}>{description}</p>}
        {(primaryCta || secondaryCta) && (
          <div className={classes.actions}>
            {primaryCta && (
              <Button
                label={primaryCta.label}
                href={primaryCta.href}
                variant="filled"
              />
            )}
            {secondaryCta && (
              <Button
                label={secondaryCta.label}
                href={secondaryCta.href}
                variant="outlined"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
