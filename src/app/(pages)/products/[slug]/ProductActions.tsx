'use client'

import React from 'react'
import { AddToCartButton } from '@/app/_components/AddToCartButton'

type Props = {
  product: {
    id: string
    title: string
    slug: string
    price: number
    stock?: number
    images?: { image: { url?: string; alt?: string } }[]
    categories?: ({ title: string } | string)[]
  }
}

export const ProductActions: React.FC<Props> = ({ product }) => {
  const inStock = product.stock == null || product.stock > 0

  if (!inStock) return null

  return (
    <AddToCartButton
      product={{
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        images: product.images,
        categories: product.categories,
      }}
    />
  )
}
