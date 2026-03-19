import React from 'react'
import Link from 'next/link'
import classes from './index.module.scss'

type Props = {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'filled' | 'outlined'
  size?: 'default' | 'small'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export const Button: React.FC<Props> = ({
  label,
  href,
  onClick,
  variant = 'filled',
  size = 'default',
  type = 'button',
  disabled = false,
  className,
}) => {
  const classNames = [
    classes.button,
    classes[variant],
    size === 'small' ? classes.small : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {label}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames}
    >
      {label}
    </button>
  )
}
