import React from 'react'
import classes from './page.module.scss'

export default function HomePage() {
  return (
    <main className={classes.home}>
      <section className={classes.hero}>
        <h1>Reuse. Reimagine. Reshape the future.</h1>
        <p>
          Sustainable, eco-friendly products for environmentally-conscious living.
        </p>
      </section>
    </main>
  )
}
