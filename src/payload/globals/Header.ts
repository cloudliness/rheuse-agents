import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Path (e.g. /products) or full URL' },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Button',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
