'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/_providers/Auth'
import { Button } from '@/app/_components/Button'
import classes from './page.module.scss'

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className={classes.page}>
        <p className={classes.loading}>Loading…</p>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className={classes.page}>
      <h1 className={classes.heading}>Your Account</h1>

      <div className={classes.card}>
        <h2 className={classes.cardTitle}>Profile</h2>
        <div className={classes.field}>
          <span className={classes.label}>Name</span>
          <span className={classes.value}>
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className={classes.field}>
          <span className={classes.label}>Email</span>
          <span className={classes.value}>{user.email}</span>
        </div>
        <div className={classes.field}>
          <span className={classes.label}>Role</span>
          <span className={classes.value}>{user.role}</span>
        </div>
      </div>

      <div className={classes.links}>
        <Link href="/orders" className={classes.link}>
          <span className={classes.linkIcon}>📦</span>
          <div>
            <h3 className={classes.linkTitle}>Order History</h3>
            <p className={classes.linkDesc}>View and track your past orders</p>
          </div>
        </Link>
      </div>

      <button type="button" onClick={handleLogout} className={classes.logout}>
        Sign Out
      </button>
    </div>
  )
}
