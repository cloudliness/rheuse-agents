import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Join the RHEUSE community' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Get sustainability tips, new product drops, and exclusive eco-deals.',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['Instagram', 'Twitter', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn'],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'copyright', type: 'text', defaultValue: '© RHEUSE. All rights reserved.' },
  ],
}
