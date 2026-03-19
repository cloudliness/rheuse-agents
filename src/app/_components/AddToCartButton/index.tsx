'use client'

import React from 'react'
import { useCart, type CartItem } from '../../_providers/Cart'
import { Button } from '../Button'

type Props = {
  product: CartItem['product']
  className?: string
}

export const AddToCartButton: React.FC<Props> = ({ product, className }) => {
  const { addItem } = useCart()

  return (
    <Button
      label="Add to Cart"
      onClick={() => addItem(product)}
      variant="filled"
      className={className}
    />
  )
}
