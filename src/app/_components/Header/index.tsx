import React from 'react'
import Link from 'next/link'
import { CartLink } from '../CartLink'
import classes from './index.module.scss'

type NavLink = {
  label: string
  url: string
}

type Props = {
  siteName?: string
  navLinks?: NavLink[]
}

export const Header: React.FC<Props> = ({
  siteName = 'RHEUSE',
  navLinks = [],
}) => {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href="/" className={classes.logo}>
          {siteName}
        </Link>

        {navLinks.length > 0 && (
          <nav className={classes.nav} aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={classes.navLink}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={classes.actions}>
          <CartLink />
          <Link href="/account" className={classes.iconLink} aria-label="Account">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
