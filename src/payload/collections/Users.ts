import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isSuperAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isSuperAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'stripeCustomerID', type: 'text', admin: { readOnly: true } },
  ],
}
