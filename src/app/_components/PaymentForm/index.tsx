'use client'

import React, { useState, useCallback } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/app/_components/Button'
import classes from './index.module.scss'

type Props = {
  onSuccess: (paymentIntentId: string) => void
}

export const PaymentForm: React.FC<Props> = ({ onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!stripe || !elements) return

      setProcessing(true)
      setError(null)

      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment validation failed')
        setProcessing(false)
        return
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation`,
          },
        })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed. Please try again.')
        setProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }

      setProcessing(false)
    },
    [stripe, elements, onSuccess],
  )

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {error && <p className={classes.error}>{error}</p>}

      <Button
        label={processing ? 'Processing…' : 'Pay Now'}
        variant="filled"
        type="submit"
        disabled={!stripe || processing}
        className={classes.submit}
      />

      <p className={classes.secure}>
        <span aria-hidden="true">🔒</span> Payments processed securely by Stripe
      </p>
    </form>
  )
}
