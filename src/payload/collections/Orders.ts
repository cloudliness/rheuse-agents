import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrOwner, isSuperAdmin } from '../access/roles'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
  },
  access: {
    read: isAdminOrOwner('customer'),
    create: () => true,
    update: isAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        {
          name: 'priceAtPurchase',
          type: 'number',
          required: true,
          admin: { description: 'Snapshot of price in cents at time of purchase' },
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: { readOnly: true, description: 'Total in cents' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Returned', value: 'returned' },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'carbonOffset',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Customer opted for carbon-neutral shipping' },
    },
    {
      name: 'ecoImpact',
      type: 'group',
      label: 'Order Eco Impact',
      admin: { readOnly: true },
      fields: [
        { name: 'totalRecycledPercentage', type: 'number' },
        { name: 'totalCarbonSavedKg', type: 'number' },
      ],
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal admin notes' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.orderNumber = `RH-${Date.now().toString(36).toUpperCase()}`
        }
        return data
      },
    ],
    afterChange: [
      // Decrease stock when order is confirmed
      async ({ doc, previousDoc, req }) => {
        if (doc.status === 'confirmed' && previousDoc?.status === 'pending') {
          for (const item of doc.items) {
            const productId = typeof item.product === 'string' ? item.product : item.product.id
            const product = await req.payload.findByID({ collection: 'products', id: productId })
            await req.payload.update({
              collection: 'products',
              id: productId,
              data: { stock: Math.max(0, (product.stock ?? 0) - item.quantity) },
            })
          }
        }
      },
    ],
  },
}
