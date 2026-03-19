import type { Field } from 'payload'

export const linkField: Field = {
  name: 'link',
  type: 'group',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Internal Page', value: 'internal' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'internal',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'external',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
