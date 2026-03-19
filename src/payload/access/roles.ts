import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) =>
  Boolean(user?.role === 'super-admin' || user?.role === 'admin')

export const isSuperAdmin: Access = ({ req: { user } }) =>
  Boolean(user?.role === 'super-admin')

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.role === 'super-admin' || user?.role === 'admin') return true
  if (!user) return false
  return { id: { equals: user.id } }
}

export const isAdminOrOwner = (ownerField: string): Access => ({ req: { user } }) => {
  if (user?.role === 'super-admin' || user?.role === 'admin') return true
  if (!user) return false
  return { [ownerField]: { equals: user.id } }
}

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  Boolean(user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'editor')

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

export const anyone: Access = () => true
