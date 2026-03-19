import type { CollectionConfig } from 'payload'
import { isAdmin, isSuperAdmin } from '../access/roles'

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'isActive', 'usesRemaining'],
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage Off', value: 'percentage' },
        { label: 'Fixed Amount Off', value: 'fixed' },
        { label: 'Free Shipping', value: 'free-shipping' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: { description: 'Percentage (0–100) or fixed amount in cents' },
    },
    {
      name: 'minimumOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Minimum order total in cents (0 = no minimum)' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    {
      name: 'usesRemaining',
      type: 'number',
      admin: { description: 'Leave empty for unlimited uses' },
    },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    {
      name: 'appliesTo',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Limit to specific categories. Leave empty for all products.' },
    },
  ],
}
