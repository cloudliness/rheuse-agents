import type { CollectionConfig } from 'payload'
import { anyone } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../media',
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'card', width: 600, height: 600, position: 'centre' },
      { name: 'hero', width: 1200, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'createdAt'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive alt text for accessibility and SEO',
      },
    },
  ],
}
