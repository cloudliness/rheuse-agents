import React from 'react'
import classes from './index.module.scss'

type Props = {
  amount: number // price in cents
  compareAt?: number // original price in cents (for showing savings)
  currency?: string
  className?: string
}

export const Price: React.FC<Props> = ({
  amount,
  compareAt,
  currency = 'USD',
  className,
}) => {
  const format = (cents: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100)

  return (
    <div className={`${classes.price} ${className || ''}`}>
      <span className={compareAt ? classes.sale : ''}>
        {format(amount)}
      </span>
      {compareAt && compareAt > amount && (
        <span className={classes.compareAt}>{format(compareAt)}</span>
      )}
    </div>
  )
}
