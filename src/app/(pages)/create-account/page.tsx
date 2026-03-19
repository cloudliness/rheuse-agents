'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/_providers/Auth'
import { Input } from '@/app/_components/Input'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

export default function CreateAccountPage() {
  const { createAccount } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      await createAccount({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      })
      router.push('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h1 className={classes.heading}>Create Account</h1>
        <p className={classes.subtitle}>
          Join the RHEUSE community.
        </p>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.row}>
            <Input
              name="firstName"
              label="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <Input
              name="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className={classes.error}>{error}</p>}

          <Button
            label={submitting ? 'Creating Account…' : 'Create Account'}
            variant="filled"
            className={classes.submit}
            type="submit"
          />
        </form>

        <p className={classes.switch}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
