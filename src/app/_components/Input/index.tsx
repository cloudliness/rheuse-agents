import React from 'react'
import classes from './index.module.scss'

type Props = {
  name: string
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
  className?: string
}

export const Input: React.FC<Props> = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className,
}) => {
  return (
    <div className={`${classes.field} ${className || ''}`}>
      {label && (
        <label htmlFor={name} className={classes.label}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`${classes.input} ${error ? classes.hasError : ''}`}
      />
      {error && <span className={classes.error}>{error}</span>}
    </div>
  )
}
