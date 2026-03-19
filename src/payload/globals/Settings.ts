import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'RHEUSE',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Reuse. Reimagine. Reshape the future.',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Default SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          defaultValue: 'RHEUSE — Sustainable Eco-Friendly Products',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue:
            'Shop sustainable, eco-friendly products at RHEUSE. Reusable, recycled, and responsibly made goods for environmentally-conscious living.',
        },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
  ],
}
