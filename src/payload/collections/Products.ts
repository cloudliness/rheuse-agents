import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { anyone, isAdminOrEditor } from '../access/roles'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'stock', 'createdAt'],
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    { name: 'description', type: 'richText' },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Price in cents (e.g. 1999 = $19.99)' },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: { description: 'Original price in cents (shown crossed out when higher than price)' },
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'ecoData',
      type: 'group',
      label: 'Eco Impact Data',
      fields: [
        {
          name: 'recycledPercentage',
          type: 'number',
          min: 0,
          max: 100,
          admin: { description: 'Percentage of recycled materials (0–100)' },
        },
        {
          name: 'carbonSavedKg',
          type: 'number',
          min: 0,
          admin: { description: 'kg of CO₂ saved vs. conventional product' },
        },
        {
          name: 'materials',
          type: 'array',
          fields: [
            { name: 'material', type: 'text', required: true },
          ],
        },
        {
          name: 'certifications',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Fair Trade', value: 'fair-trade' },
            { label: 'Organic', value: 'organic' },
            { label: 'B Corp', value: 'b-corp' },
            { label: 'Carbon Neutral', value: 'carbon-neutral' },
            { label: 'FSC Certified', value: 'fsc' },
            { label: 'Cradle to Cradle', value: 'cradle-to-cradle' },
            { label: 'GOTS', value: 'gots' },
            { label: 'OEKO-TEX', value: 'oeko-tex' },
          ],
        },
        { name: 'ecoStatement', type: 'textarea' },
      ],
    },
    {
      name: 'stripeProductID',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: { description: 'Inventory count', position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      // Prevent negative stock
      async ({ data }) => {
        if (data?.stock !== undefined && data.stock < 0) {
          throw new Error('Stock cannot be negative')
        }
        return data
      },
    ],
    afterChange: [
      // Low stock warning
      async ({ doc }) => {
        if (doc.stock <= 5 && doc.stock > 0) {
          console.warn(`[RHEUSE] Low stock: "${doc.title}" has ${doc.stock} units remaining`)
        }
        if (doc.stock === 0) {
          console.warn(`[RHEUSE] Out of stock: "${doc.title}"`)
        }
      },
    ],
  },
}
