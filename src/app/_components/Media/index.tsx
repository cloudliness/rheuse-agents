import React from 'react'
import Image from 'next/image'
import classes from './index.module.scss'

type Props = {
  resource?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  } | string
  alt?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

export const Media: React.FC<Props> = ({
  resource,
  alt: altOverride,
  fill = false,
  sizes,
  priority = false,
  className,
}) => {
  if (!resource) return null

  if (typeof resource === 'string') {
    return (
      <Image
        src={resource}
        alt={altOverride || ''}
        fill={fill}
        width={fill ? undefined : 600}
        height={fill ? undefined : 400}
        sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
        priority={priority}
        className={`${classes.image} ${className || ''}`}
      />
    )
  }

  const { url, alt, width, height } = resource
  if (!url) return null

  return (
    <Image
      src={url}
      alt={altOverride || alt || ''}
      fill={fill}
      width={fill ? undefined : width || 600}
      height={fill ? undefined : height || 400}
      sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
      priority={priority}
      className={`${classes.image} ${className || ''}`}
    />
  )
}
