'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'

export const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    configPromise: (await import('@payload-config')).default,
    importMap,
  })
}

import { importMap } from './admin/[[...segments]]/importMap'
