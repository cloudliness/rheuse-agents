import type { Field } from 'payload'

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier. Auto-generated from title if left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (!value && data?.title) {
          return data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return value
      },
    ],
  },
}
