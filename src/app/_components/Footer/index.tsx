import React from 'react'
import Link from 'next/link'
import classes from './index.module.scss'

type FooterColumn = {
  heading: string
  links: { label: string; url: string }[]
}

type SocialLink = {
  platform: string
  url: string
}

type Props = {
  siteName?: string
  tagline?: string
  columns?: FooterColumn[]
  socialLinks?: SocialLink[]
  copyright?: string
}

export const Footer: React.FC<Props> = ({
  siteName = 'RHEUSE',
  tagline = 'Reuse. Reimagine. Reshape the future.',
  columns = [],
  socialLinks = [],
  copyright,
}) => {
  const year = new Date().getFullYear()

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.brand}>
          <Link href="/" className={classes.logo}>
            {siteName}
          </Link>
          <p className={classes.tagline}>{tagline}</p>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className={classes.column}>
            <h4 className={classes.columnHeading}>{col.heading}</h4>
            <ul className={classes.linkList}>
              {col.links.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className={classes.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {socialLinks.length > 0 && (
          <div className={classes.column}>
            <h4 className={classes.columnHeading}>Connect</h4>
            <div className={classes.social}>
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialLink}
                  aria-label={s.platform}
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={classes.bottom}>
        <p className={classes.copyright}>
          {copyright || `© ${year} ${siteName}. Conscious Living for a Better Planet.`}
        </p>
      </div>
    </footer>
  )
}
