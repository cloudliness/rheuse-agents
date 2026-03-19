import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Discounts } from './collections/Discounts'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— RHEUSE Admin',
    },
  },
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/rheuse',
  }),
  collections: [Users, Media, Categories, Products, Orders, Pages, Discounts],
  globals: [Header, Footer, Settings],
  secret: process.env.PAYLOAD_SECRET || 'UNSAFE-DEFAULT-SECRET-CHANGE-ME',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
})
