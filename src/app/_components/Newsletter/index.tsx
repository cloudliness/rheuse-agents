'use client'

import React, { useState } from 'react'
import { Button } from '../Button'
import classes from './index.module.scss'

type Props = {
  label?: string
  heading?: string
  placeholder?: string
}

export const Newsletter: React.FC<Props> = ({
  label = 'Join the Atelier',
  heading = 'Receive early access to limited artisanal drops and sustainability insights.',
  placeholder = 'Your email address',
}) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter submission will be wired in a later phase
    setEmail('')
  }

  return (
    <section className={classes.section}>
      <span className={classes.label}>{label}</span>
      <h2 className={classes.heading}>{heading}</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className={classes.input}
          aria-label="Email address"
        />
        <Button label="Subscribe" type="submit" variant="filled" size="small" />
      </form>
    </section>
  )
}
