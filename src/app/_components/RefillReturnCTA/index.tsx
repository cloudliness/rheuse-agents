import React from 'react'
import classes from './index.module.scss'

type Props = {
  className?: string
}

export const RefillReturnCTA: React.FC<Props> = ({ className }) => {
  return (
    <section className={`${classes.section} ${className || ''}`}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <span className={classes.label}>Circular Program</span>
          <h2 className={classes.heading}>
            Return. <em>Refill.</em> Repeat.
          </h2>
          <p className={classes.description}>
            Done with a product? Don&apos;t toss it. Send it back to us and
            we&apos;ll refurbish, recycle, or refill it — then give you store
            credit toward your next conscious purchase.
          </p>

          <div className={classes.steps}>
            <div className={classes.step}>
              <span className={classes.stepNumber}>01</span>
              <span className={classes.stepText}>Request a free return label</span>
            </div>
            <div className={classes.step}>
              <span className={classes.stepNumber}>02</span>
              <span className={classes.stepText}>Ship your used product back</span>
            </div>
            <div className={classes.step}>
              <span className={classes.stepNumber}>03</span>
              <span className={classes.stepText}>Receive store credit &amp; eco impact update</span>
            </div>
          </div>

          <a href="/refill-return" className={classes.cta}>
            Start a Return
          </a>
        </div>

        <div className={classes.visual}>
          <div className={classes.iconLoop}>
            <span>📦</span>
            <span className={classes.arrow}>→</span>
            <span>♻️</span>
            <span className={classes.arrow}>→</span>
            <span>🌱</span>
          </div>
        </div>
      </div>
    </section>
  )
}
