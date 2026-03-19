import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { anyone, isAdminOrEditor } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
    { name: 'content', type: 'richText' },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', admin: { description: 'Override page title for SEO' } },
        { name: 'description', type: 'textarea', admin: { description: 'Meta description (150–160 chars)' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
