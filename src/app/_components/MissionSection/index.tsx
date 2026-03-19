import React from 'react'
import classes from './index.module.scss'

export const MissionSection: React.FC = () => {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <div className={classes.imageCol}>
          <div className={classes.imagePlaceholder} />
        </div>
        <div className={classes.textCol}>
          <span className={classes.label}>Our Mission</span>
          <h2 className={classes.heading}>
            Redefining the Ritual of Consumption
          </h2>
          <p className={classes.body}>
            Every piece we create is a response to the plastic tide. We believe
            that small, intentional choices — like carrying your own utensils —
            ripple outward to create significant change. Our mission is to reduce
            single-use waste without compromising on aesthetic or tactile quality.
          </p>
          <div className={classes.stats}>
            <div className={classes.stat}>
              <h4 className={classes.statTitle}>Zero Waste</h4>
              <p className={classes.statDesc}>
                Circular production methods that prioritize the planet.
              </p>
            </div>
            <div className={classes.stat}>
              <h4 className={classes.statTitle}>Pure Sourcing</h4>
              <p className={classes.statDesc}>
                FSC-certified bamboo and medical-grade steel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
