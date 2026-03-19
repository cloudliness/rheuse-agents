'use client'

import React from 'react'
import classes from './index.module.scss'

type Props = {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
}

export const QuantityStepper: React.FC<Props> = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
}) => {
  return (
    <div className={classes.stepper}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={classes.btn}
        aria-label="Decrease quantity"
      >
        &ndash;
      </button>
      <span className={classes.value}>{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={classes.btn}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
