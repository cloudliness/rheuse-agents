'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/_providers/Auth'
import { Input } from '@/app/_components/Input'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login(email, password)
      router.push('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h1 className={classes.heading}>Welcome Back</h1>
        <p className={classes.subtitle}>
          Sign in to your RHEUSE account.
        </p>

        <form onSubmit={handleSubmit} className={classes.form}>
          <Input
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className={classes.error}>{error}</p>}

          <Button
            label={submitting ? 'Signing In…' : 'Sign In'}
            variant="filled"
            className={classes.submit}
            type="submit"
          />
        </form>

        <p className={classes.switch}>
          Don&apos;t have an account?{' '}
          <Link href="/create-account">Create one</Link>
        </p>
      </div>
    </div>
  )
}
