/**
 * RHEUSE Database Seed Script
 *
 * Creates mock categories, products (with placeholder images), pages,
 * header/footer globals, and a discount code.
 *
 * Usage:
 *   node src/seed/index.mjs
 *
 * Requires the app to be running at NEXT_PUBLIC_APP_URL (default http://localhost:3000)
 * and an admin user to already exist.
 */

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const API = `${BASE}/api`

// ── Admin credentials ────────────────────────────────────
const ADMIN_EMAIL = process.env.SEED_EMAIL || 'admin@rheuse.com'
const ADMIN_PASSWORD = process.env.SEED_PASSWORD || 'Admin1234!'

// ── Helpers ──────────────────────────────────────────────

let token = null

async function login() {
  // First try to login
  let res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!res.ok) {
    // If login fails, try creating the first user
    console.log('Login failed — creating first admin user…')
    res = await fetch(`${API}/users/first-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: 'RHEUSE Admin',
        role: 'super-admin',
      }),
    })

    if (!res.ok) {
      // Try the regular create endpoint (Payload v3)
      res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: 'RHEUSE Admin',
          role: 'super-admin',
        }),
      })
    }

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Could not create admin user: ${res.status} ${text}`)
    }

    // Now login
    res = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
  }

  const data = await res.json()
  token = data.token
  console.log('✓ Authenticated as', ADMIN_EMAIL)
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `JWT ${token}` } : {}),
  }
}

async function create(collection, body) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`  ✗ ${collection}:`, text)
    return null
  }
  const data = await res.json()
  return data.doc
}

async function findBySlug(collection, slug) {
  const res = await fetch(`${API}/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
    headers: authHeaders(),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.docs?.[0] || null
}

async function createOrFind(collection, body) {
  if (body.slug) {
    const existing = await findBySlug(collection, body.slug)
    if (existing) {
      console.log(`  ↩ ${body.title || body.slug} (exists)`)
      return existing
    }
  }
  return create(collection, body)
}

async function updateGlobal(slug, body) {
  const res = await fetch(`${API}/globals/${slug}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`  ✗ global ${slug}:`, text)
    return null
  }
  return (await res.json()).result || true
}

/**
 * Upload a placeholder image generated via a public service.
 * Falls back to a 1x1 transparent PNG if the fetch fails.
 */
async function uploadImage(alt, width = 800, height = 800, label = '') {
  const text = encodeURIComponent(label || alt)
  const url = `https://placehold.co/${width}x${height}/1F4D38/FFFFFF/png?text=${text}`

  let imageBuffer
  let filename
  let mimeType = 'image/png'

  try {
    const res = await fetch(url)
    if (res.ok) {
      imageBuffer = Buffer.from(await res.arrayBuffer())
      filename = `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
    } else {
      throw new Error('Placeholder service unavailable')
    }
  } catch {
    // Fallback: tiny 1x1 green PNG
    imageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )
    filename = `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-placeholder.png`
  }

  const form = new FormData()
  form.append('_payload', JSON.stringify({ alt }))
  form.append('file', new Blob([imageBuffer], { type: mimeType }), filename)

  const res = await fetch(`${API}/media`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`  ✗ media upload "${alt}":`, text)
    return null
  }

  const data = await res.json()
  console.log(`  ✓ Uploaded: ${alt} → ${data.doc.id}`)
  return data.doc.id
}

// ── Seed Data ────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 Seeding RHEUSE database…\n')

  await login()

  // ── 1. Upload product images ──
  console.log('\n📷 Uploading images…')
  const images = {}

  const imageList = [
    ['Bamboo Water Bottle', 600, 600, 'Bamboo\\nBottle'],
    ['Recycled Tote Bag', 600, 600, 'Tote\\nBag'],
    ['Organic Cotton T-Shirt', 600, 600, 'Organic\\nTee'],
    ['Beeswax Food Wraps', 600, 600, 'Beeswax\\nWraps'],
    ['Solar Phone Charger', 600, 600, 'Solar\\nCharger'],
    ['Hemp Backpack', 600, 600, 'Hemp\\nBackpack'],
    ['Compostable Phone Case', 600, 600, 'Eco\\nCase'],
    ['Natural Yoga Mat', 600, 600, 'Yoga\\nMat'],
    ['Reusable Produce Bags Set', 600, 600, 'Produce\\nBags'],
    ['Recycled Glass Vase', 600, 600, 'Glass\\nVase'],
    ['Kitchen Category', 800, 400, 'Kitchen'],
    ['Fashion Category', 800, 400, 'Fashion'],
    ['Outdoor Category', 800, 400, 'Outdoor'],
    ['Home Category', 800, 400, 'Home'],
    ['Tech Category', 800, 400, 'Tech'],
  ]

  for (const [alt, w, h, label] of imageList) {
    images[alt] = await uploadImage(alt, w, h, label)
  }

  // ── 2. Categories ──
  console.log('\n📁 Creating categories…')

  const categories = {}
  const catData = [
    { title: 'Kitchen & Dining', slug: 'kitchen-dining', description: 'Sustainable kitchen essentials for eco-conscious cooking and dining.', image: images['Kitchen Category'] },
    { title: 'Fashion & Accessories', slug: 'fashion-accessories', description: 'Ethically made clothing and accessories from recycled and organic materials.', image: images['Fashion Category'] },
    { title: 'Outdoor & Travel', slug: 'outdoor-travel', description: 'Eco-friendly gear for adventures that tread lightly on the planet.', image: images['Outdoor Category'] },
    { title: 'Home & Living', slug: 'home-living', description: 'Sustainable home goods made from recycled and natural materials.', image: images['Home Category'] },
    { title: 'Technology', slug: 'technology', description: 'Green tech gadgets powered by renewable energy and recyclable materials.', image: images['Tech Category'] },
  ]

  for (const cat of catData) {
    const doc = await createOrFind('categories', cat)
    if (doc) {
      categories[cat.slug] = doc.id
      console.log(`  ✓ ${cat.title}`)
    }
  }

  // ── 3. Products ──
  console.log('\n🛒 Creating products…')

  const productData = [
    {
      title: 'Bamboo Water Bottle — 750ml',
      slug: 'bamboo-water-bottle',
      price: 2899,
      compareAtPrice: 3499,
      stock: 145,
      categories: [categories['kitchen-dining'], categories['outdoor-travel']],
      images: [{ image: images['Bamboo Water Bottle'] }],
      ecoData: {
        recycledPercentage: 30,
        carbonSavedKg: 2.1,
        materials: [{ material: 'Organic Bamboo' }, { material: 'Stainless Steel' }, { material: 'Silicone Seal' }],
        certifications: ['fsc', 'carbon-neutral'],
        ecoStatement: 'Crafted from FSC-certified organic bamboo with a food-grade stainless steel interior. Each bottle saves approximately 167 single-use plastic bottles per year.',
      },
    },
    {
      title: 'Recycled Ocean Plastic Tote',
      slug: 'recycled-ocean-tote',
      price: 3499,
      stock: 87,
      categories: [categories['fashion-accessories']],
      images: [{ image: images['Recycled Tote Bag'] }],
      ecoData: {
        recycledPercentage: 95,
        carbonSavedKg: 3.8,
        materials: [{ material: 'Recycled Ocean Plastic (RPET)' }, { material: 'Organic Cotton Lining' }],
        certifications: ['b-corp', 'oeko-tex'],
        ecoStatement: 'Made from 12 reclaimed ocean plastic bottles. Every purchase funds coastal cleanup operations across Southeast Asia.',
      },
    },
    {
      title: 'Organic Cotton Everyday Tee',
      slug: 'organic-cotton-tee',
      price: 4200,
      compareAtPrice: 4800,
      stock: 200,
      categories: [categories['fashion-accessories']],
      images: [{ image: images['Organic Cotton T-Shirt'] }],
      ecoData: {
        recycledPercentage: 0,
        carbonSavedKg: 5.2,
        materials: [{ material: '100% GOTS Organic Cotton' }],
        certifications: ['gots', 'fair-trade', 'oeko-tex'],
        ecoStatement: 'Zero pesticides, zero synthetic fertilizers. Grown by fair-trade cooperatives in India. Uses 91% less water than conventional cotton.',
      },
    },
    {
      title: 'Beeswax Food Wrap Set (3-Pack)',
      slug: 'beeswax-food-wraps',
      price: 1899,
      stock: 320,
      categories: [categories['kitchen-dining']],
      images: [{ image: images['Beeswax Food Wraps'] }],
      ecoData: {
        recycledPercentage: 0,
        carbonSavedKg: 1.5,
        materials: [{ material: 'Organic Cotton Muslin' }, { material: 'Beeswax' }, { material: 'Jojoba Oil' }, { material: 'Tree Resin' }],
        certifications: ['organic'],
        ecoStatement: 'Replace hundreds of meters of cling film. Each wrap lasts up to 1 year with proper care. Fully compostable at end of life.',
      },
    },
    {
      title: 'Solar-Powered Phone Charger',
      slug: 'solar-phone-charger',
      price: 5999,
      compareAtPrice: 7499,
      stock: 42,
      categories: [categories['technology'], categories['outdoor-travel']],
      images: [{ image: images['Solar Phone Charger'] }],
      ecoData: {
        recycledPercentage: 45,
        carbonSavedKg: 8.5,
        materials: [{ material: 'Monocrystalline Solar Cells' }, { material: 'Recycled Aluminum' }, { material: 'Recycled ABS Plastic' }],
        certifications: ['carbon-neutral', 'cradle-to-cradle'],
        ecoStatement: 'Harness the sun for unlimited clean energy. Housing made from 45% recycled materials. Designed for disassembly and full recyclability.',
      },
    },
    {
      title: 'Hemp Canvas Backpack',
      slug: 'hemp-canvas-backpack',
      price: 7899,
      stock: 63,
      categories: [categories['fashion-accessories'], categories['outdoor-travel']],
      images: [{ image: images['Hemp Backpack'] }],
      ecoData: {
        recycledPercentage: 20,
        carbonSavedKg: 4.3,
        materials: [{ material: 'Organic Hemp Canvas' }, { material: 'Recycled Polyester Lining' }, { material: 'Coconut Shell Buttons' }],
        certifications: ['fair-trade', 'fsc'],
        ecoStatement: 'Hemp requires zero pesticides and 1/4 the water of cotton. Handcrafted by artisan cooperatives in Nepal.',
      },
    },
    {
      title: 'Compostable Phone Case',
      slug: 'compostable-phone-case',
      price: 2499,
      stock: 500,
      categories: [categories['technology']],
      images: [{ image: images['Compostable Phone Case'] }],
      ecoData: {
        recycledPercentage: 0,
        carbonSavedKg: 0.8,
        materials: [{ material: 'Flax Fiber' }, { material: 'PBAT Bioplastic' }],
        certifications: ['carbon-neutral'],
        ecoStatement: 'Fully compostable in 180 days. Made from plant-based bioplastics and natural flax fiber. Protects your phone and the planet.',
      },
    },
    {
      title: 'Natural Rubber Yoga Mat',
      slug: 'natural-yoga-mat',
      price: 6499,
      compareAtPrice: 7999,
      stock: 78,
      categories: [categories['home-living'], categories['outdoor-travel']],
      images: [{ image: images['Natural Yoga Mat'] }],
      ecoData: {
        recycledPercentage: 10,
        carbonSavedKg: 3.2,
        materials: [{ material: 'Natural Tree Rubber' }, { material: 'Organic Cotton Surface' }],
        certifications: ['oeko-tex', 'fsc'],
        ecoStatement: 'Harvested from sustainable rubber tree plantations. No PVC, no TPE, no synthetic chemicals. Biodegradable at end of life.',
      },
    },
    {
      title: 'Reusable Organic Produce Bags (Set of 6)',
      slug: 'reusable-produce-bags',
      price: 1599,
      stock: 410,
      categories: [categories['kitchen-dining']],
      images: [{ image: images['Reusable Produce Bags Set'] }],
      ecoData: {
        recycledPercentage: 0,
        carbonSavedKg: 1.2,
        materials: [{ material: 'Organic Cotton Mesh' }, { material: 'Organic Cotton Drawstring' }],
        certifications: ['gots', 'organic'],
        ecoStatement: 'Replace 500+ single-use plastic bags per year. Machine washable, lightweight, and perfect for farmers markets.',
      },
    },
    {
      title: 'Recycled Glass Flower Vase',
      slug: 'recycled-glass-vase',
      price: 3299,
      stock: 55,
      categories: [categories['home-living']],
      images: [{ image: images['Recycled Glass Vase'] }],
      ecoData: {
        recycledPercentage: 100,
        carbonSavedKg: 2.7,
        materials: [{ material: '100% Recycled Glass' }],
        certifications: ['b-corp', 'cradle-to-cradle'],
        ecoStatement: 'Each vase is hand-blown from 100% post-consumer recycled glass. No two pieces are alike. Infinitely recyclable.',
      },
    },
  ]

  for (const product of productData) {
    // Filter out null category/image IDs
    product.categories = (product.categories || []).filter(Boolean)
    product.images = (product.images || []).filter(i => i.image)
    const doc = await createOrFind('products', product)
    if (doc) {
      console.log(`  ✓ ${product.title} — $${(product.price / 100).toFixed(2)}`)
    }
  }

  // ── 4. CMS Pages ──
  console.log('\n📄 Creating pages…')

  const pages = [
    {
      title: 'About RHEUSE',
      slug: 'about',
      meta: {
        title: 'About RHEUSE — Our Mission for a Sustainable Future',
        description: 'Learn how RHEUSE is redefining commerce through sustainability, ethical sourcing, and circular economy principles.',
      },
    },
    {
      title: 'Sustainability',
      slug: 'sustainability',
      meta: {
        title: 'Our Sustainability Commitment — RHEUSE',
        description: 'Discover RHEUSE\'s environmental commitments: carbon-neutral shipping, zero-waste packaging, and transparent supply chains.',
      },
    },
    {
      title: 'Shipping & Returns',
      slug: 'shipping-returns',
      meta: {
        title: 'Shipping & Returns — RHEUSE',
        description: 'Free carbon-neutral shipping on orders over $50. Easy 30-day returns with our circular return program.',
      },
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      meta: {
        title: 'Contact RHEUSE — Get in Touch',
        description: 'Questions about our products or sustainability practices? We\'d love to hear from you.',
      },
    },
  ]

  for (const page of pages) {
    const doc = await create('pages', page)
    if (doc) console.log(`  ✓ ${page.title}`)
  }

  // ── 5. Discount code ──
  console.log('\n🏷️  Creating discount code…')
  const discount = await create('discounts', {
    code: 'ECOSAVE15',
    type: 'percentage',
    value: 15,
    minimumOrder: 3000,
    isActive: true,
    usesRemaining: 100,
  })
  if (discount) console.log(`  ✓ ECOSAVE15 — 15% off (min $30)`)

  // ── 6. Header global ──
  console.log('\n🔗 Setting up header navigation…')
  await updateGlobal('header', {
    navLinks: [
      { label: 'Shop All', type: 'internal', url: '/products' },
      { label: 'About', type: 'internal', url: '/about' },
      { label: 'Sustainability', type: 'internal', url: '/sustainability' },
      { label: 'Contact', type: 'internal', url: '/contact' },
    ],
    cta: {
      label: 'Shop Now',
      url: '/products',
    },
  })
  console.log('  ✓ Header nav configured')

  // ── 7. Footer global ──
  console.log('\n🦶 Setting up footer…')
  await updateGlobal('footer', {
    columns: [
      {
        heading: 'Shop',
        links: [
          { label: 'All Products', url: '/products' },
          { label: 'Kitchen & Dining', url: '/products?category=kitchen-dining' },
          { label: 'Fashion', url: '/products?category=fashion-accessories' },
          { label: 'Home & Living', url: '/products?category=home-living' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About RHEUSE', url: '/about' },
          { label: 'Sustainability', url: '/sustainability' },
          { label: 'Contact Us', url: '/contact' },
        ],
      },
      {
        heading: 'Help',
        links: [
          { label: 'Shipping & Returns', url: '/shipping-returns' },
          { label: 'My Account', url: '/account' },
          { label: 'My Orders', url: '/orders' },
        ],
      },
    ],
    newsletter: {
      heading: 'Join the RHEUSE community',
      description: 'Get sustainability tips, new product drops, and exclusive eco-deals. No spam, just good vibes for the planet.',
    },
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/rheuse' },
      { platform: 'Twitter', url: 'https://twitter.com/rheuse' },
      { platform: 'TikTok', url: 'https://tiktok.com/@rheuse' },
    ],
    copyright: '© 2026 RHEUSE. All rights reserved.',
  })
  console.log('  ✓ Footer configured')

  // ── 8. Settings global ──
  console.log('\n⚙️  Configuring site settings…')
  await updateGlobal('settings', {
    siteName: 'RHEUSE',
    tagline: 'Reuse. Reimagine. Reshape the future.',
    seo: {
      metaTitle: 'RHEUSE — Sustainable Eco-Friendly Products',
      metaDescription: 'Shop sustainable, eco-friendly products at RHEUSE. Reusable, recycled, and responsibly made goods for environmentally-conscious living.',
    },
    contact: {
      email: 'hello@rheuse.com',
      phone: '+1 (555) 123-4567',
      address: '123 Green Street\nPortland, OR 97201\nUnited States',
    },
  })
  console.log('  ✓ Site settings configured')

  console.log('\n✅ Seeding complete!\n')
  console.log('   Visit http://localhost:3000/admin to manage your store')
  console.log('   Visit http://localhost:3000/products to see products\n')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
