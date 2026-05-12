import { PrismaClient, UserRole, ItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function slug(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ─── Category Data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Gen AI', slug: 'gen-ai', icon: '✨', description: 'AI-powered creative tools' },
  { name: 'Video Templates', slug: 'video-templates', icon: '🎬', description: 'Professional video templates' },
  { name: 'Stock Video', slug: 'stock-video', icon: '🎥', description: 'High-quality stock footage' },
  { name: 'Audio', slug: 'audio', icon: '🎵', description: 'Royalty-free music & sound effects' },
  { name: 'Graphics', slug: 'graphics', icon: '🎨', description: 'Illustrations, icons & more' },
  { name: 'Design Templates', slug: 'design-templates', icon: '📐', description: 'Print & digital templates' },
  { name: 'Photos', slug: 'photos', icon: '📸', description: 'Stock photography' },
  { name: '3D', slug: '3d', icon: '🧊', description: '3D models, renders & assets' },
  { name: 'Fonts', slug: 'fonts', icon: '🖋', description: 'Premium typefaces' },
  { name: 'Web', slug: 'web', icon: '🌐', description: 'Website & app templates' },
]

const SUBCATEGORIES: Record<string, string[]> = {
  'gen-ai': ['ImageGen', 'VideoGen', 'MusicGen', 'VoiceGen', 'SoundGen', 'GraphicsGen', 'MockupGen', 'ImageEdit'],
  'video-templates': ['Broadcast Packages', 'Logo Reveals', 'Promos', 'LUTs', 'Title Sequences', 'Infographics', 'Video Displays', 'Video Intros', 'Elements'],
  'stock-video': ['Background', 'Nature', 'Business', 'Woman', 'Technology', 'People', 'Man', 'Travel', 'Drone', 'Green Screen'],
  'audio': ['Background Music', 'Epic', 'Upbeat', 'Corporate', 'Happy', 'Rock', 'Funk', 'Gaming', 'Transitions', 'Domestic', 'Human', 'Urban', 'Nature', 'Futuristic', 'Interface'],
  'graphics': ['Objects', 'Illustrations', 'Icons', 'Backgrounds', 'Textures', 'Patterns', 'Actions and Presets', 'Brushes', 'Layer Styles'],
  'design-templates': ['Social Media', 'Product Mockups', 'Infographics', 'Logos', 'Business Card', 'Brochure', 'Flyer', 'Resume', 'Poster', 'Presentation'],
  'photos': ['Background', 'Office', 'Business', 'Sky', 'Paper Texture', 'Beach', 'Technology', 'Lifestyle', 'Fashion', 'Food'],
  '3d': ['Models', 'Templates', 'Renders', 'Themes', 'Nature', 'Abstract', 'Transportation', 'Architecture', 'Characters', 'Furniture'],
  'fonts': ['Serif', 'Sans-Serif', 'Script and Handwritten', 'Decorative', 'Display', 'Monospace', 'Arabic', 'Vintage'],
  'web': ['Admin Templates', 'Email Templates', 'Site Templates', 'Landing Page Templates', 'CMS Templates', 'WordPress', 'React', 'eCommerce', 'Portfolio', 'Blog'],
}

// ─── Item Templates ───────────────────────────────────────────────────────────

const ITEM_TITLES: Record<string, string[]> = {
  'gen-ai': ['Neural Dream Studio', 'AI Vision Pack', 'Prompt Mastery Kit', 'Creative AI Bundle', 'DeepStyle Generator', 'Synthwave Visuals', 'Portrait AI Studio', 'Landscape Dream AI'],
  'video-templates': ['Modern Broadcast Pack', 'Cinematic Logo Reveal', 'Corporate Promo Kit', 'Neon Title Sequence', 'Minimal Infographic Pack', 'Sports Broadcast', 'News Intro Package', 'Wedding Video Template', 'YouTube Intro Pack', 'Social Media Stories'],
  'stock-video': ['Urban City Timelapse', 'Mountain Sunset Footage', 'Office People Working', 'Technology Abstract', 'Beach Waves 4K', 'Nature Forest Walk', 'Drone Cityscape', 'Business Meeting Footage', 'Woman Using Laptop', 'Travel Montage'],
  'audio': ['Epic Cinematic Score', 'Corporate Upbeat Track', 'Chill Lo-Fi Beats', 'Rock Energy Pack', 'Podcast Intro Music', 'Game Sound Effects', 'UI Click Pack', 'Nature Ambience', 'Happy Birthday Song', 'Breaking News Intro'],
  'graphics': ['Mega Icon Pack 5000', 'Watercolor Illustration Set', 'Gradient Backgrounds Pack', 'Halftone Textures', 'Line Art Collection', 'Food Icons Bundle', 'Arrow Set Pro', 'Abstract Shapes Kit', 'Pattern Design Pack', 'Vintage Badges'],
  'design-templates': ['Instagram Story Pack', 'Business Card Collection', 'Resume Template Pro', 'Corporate Brochure', 'Event Flyer Bundle', 'Brand Identity Kit', 'Social Media Mockup', 'Product Packaging', 'Wedding Invitation', 'YouTube Thumbnail Pack'],
  'photos': ['Business Office Stock Pack', 'Nature Photography Bundle', 'Fashion Lifestyle Photos', 'Food Photography Kit', 'Technology Abstract Photos', 'Travel Photography Set', 'Sky Backgrounds Pack', 'Paper Texture Bundle', 'Minimal Workspace Photos', 'People Diversity Pack'],
  '3d': ['Modern Furniture Models', 'Car 3D Model Pack', 'Abstract 3D Renders', 'Architecture Visualization', 'Character 3D Bundle', 'Nature Tree Models', 'Product Mockup 3D', 'Sci-Fi Environment', 'Kitchen Items 3D', 'Trophy 3D Model'],
  'fonts': ['Luxury Serif Font Family', 'Modern Sans-Serif Pro', 'Handwritten Script Bundle', 'Vintage Display Font', 'Clean Minimal Typeface', 'Bold Headline Font', 'Arabic Calligraphy', 'Retro Neon Font', 'Logo Font Pack', 'Sports Font Bundle'],
  'web': ['SaaS Admin Dashboard', 'E-Commerce Landing Page', 'Portfolio One-Page Site', 'Blog WordPress Theme', 'Agency Website Template', 'App Landing Page', 'Corporate Site Template', 'Restaurant Website', 'Event Landing Page', 'Startup Website Kit'],
}

const TAGS: Record<string, string[]> = {
  'gen-ai': ['ai', 'generator', 'text-to-image', 'creative', 'neural', 'machine-learning'],
  'video-templates': ['after-effects', 'premiere-pro', 'motion', 'animation', 'broadcast', 'commercial'],
  'stock-video': ['4k', 'hd', 'footage', 'b-roll', 'cinematic', 'stock'],
  'audio': ['royalty-free', 'music', 'sound', 'audio', 'background', 'loop'],
  'graphics': ['vector', 'illustration', 'icon', 'graphic', 'design', 'svg'],
  'design-templates': ['template', 'print', 'digital', 'marketing', 'brand', 'social'],
  'photos': ['photography', 'stock-photo', 'hd', 'commercial', 'lifestyle', 'editorial'],
  '3d': ['3d', 'model', 'render', 'blender', 'cinema4d', 'visualization'],
  'fonts': ['font', 'typeface', 'typography', 'lettering', 'otf', 'ttf'],
  'web': ['html', 'css', 'react', 'nextjs', 'responsive', 'ui-kit'],
}

const COMPATIBLE_TOOLS: Record<string, string[]> = {
  'video-templates': ['Adobe After Effects', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Apple Motion'],
  'graphics': ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'Affinity'],
  'design-templates': ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Canva', 'Figma', 'Microsoft PowerPoint', 'Keynote'],
  '3d': ['Blender', 'Spline', 'Cinema 4D', '3ds Max'],
  'fonts': ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Canva'],
  'web': ['React', 'Next.js', 'WordPress', 'Elementor', 'Figma'],
}

const PICSUM_SEEDS = Array.from({ length: 200 }, (_, i) => i + 1)

function getThumbnail(seed: number, category: string): string {
  const catSeeds: Record<string, number> = {
    'video-templates': 100, 'stock-video': 200, 'audio': 300,
    'graphics': 400, 'design-templates': 500, 'photos': 600,
    '3d': 700, 'fonts': 800, 'web': 900, 'gen-ai': 50,
  }
  const base = catSeeds[category] || 0
  return `https://picsum.photos/seed/${base + (seed % 50)}/400/300`
}

function getPreviewUrls(seed: number, category: string): string[] {
  return [
    `https://picsum.photos/seed/${seed}/800/600`,
    `https://picsum.photos/seed/${seed + 1}/800/600`,
    `https://picsum.photos/seed/${seed + 2}/800/600`,
  ]
}

// ─── Main Seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Pipiklo database...')

  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE "ai_generations", "collections", "reviews", "payout_requests", "creator_earnings", "payments", "subscriptions", "licenses", "downloads", "items", "categories", "users" RESTART IDENTITY CASCADE`
  console.log('✅ Cleared existing data')

  // ── Create Admin User ──────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      clerkId: 'clerk_admin_001',
      role: UserRole.admin,
      name: 'Pipiklo Admin',
      email: 'admin@pipiklo.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isVerified: true,
    },
  })
  console.log('✅ Admin created')

  // ── Create Creators ────────────────────────────────────────────────────────
  const creatorData = [
    { name: 'Arjun Sharma', email: 'arjun@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun' },
    { name: 'Priya Patel', email: 'priya@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
    { name: 'Rahul Kumar', email: 'rahul@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul' },
    { name: 'Ananya Singh', email: 'ananya@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya' },
    { name: 'Vikram Nair', email: 'vikram@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram' },
    { name: 'Sneha Reddy', email: 'sneha@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
    { name: 'Kiran Mehta', email: 'kiran@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kiran' },
    { name: 'Divya Gupta', email: 'divya@creator.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divya' },
  ]

  const creators = await Promise.all(
    creatorData.map((c, i) =>
      prisma.user.create({
        data: {
          clerkId: `clerk_creator_00${i + 1}`,
          role: UserRole.creator,
          name: c.name,
          email: c.email,
          avatar: c.avatar,
          isVerified: true,
          bio: `Professional designer with 5+ years of experience. Specializing in creative digital assets.`,
        },
      })
    )
  )
  console.log(`✅ ${creators.length} creators created`)

  // ── Create Customers ───────────────────────────────────────────────────────
  const customers = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          clerkId: `clerk_customer_0${i + 1}`,
          role: UserRole.customer,
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=customer${i + 1}`,
        },
      })
    )
  )
  console.log(`✅ ${customers.length} customers created`)

  // ── Create Categories ──────────────────────────────────────────────────────
  const categoryMap: Record<string, { id: string; slug: string }> = {}

  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description },
    })
    categoryMap[cat.slug] = { id: created.id, slug: cat.slug }

    // Create subcategories
    const subs = SUBCATEGORIES[cat.slug] || []
    for (const sub of subs) {
      const subSlug = `${cat.slug}-${slug(sub)}`
      await prisma.category.create({
        data: {
          name: sub,
          slug: subSlug,
          parentId: created.id,
          icon: cat.icon,
        },
      })
    }
  }
  console.log('✅ Categories & subcategories created')

  // ── Create Items (1000+) ───────────────────────────────────────────────────
  let itemCount = 0
  const createdItems: { id: string; category: string }[] = []

  for (const cat of CATEGORIES) {
    const catEntry = categoryMap[cat.slug]
    const subs = SUBCATEGORIES[cat.slug] || ['General']
    const titles = ITEM_TITLES[cat.slug] || ['Creative Asset']
    const catTags = TAGS[cat.slug] || ['creative', 'digital']
    const tools = COMPATIBLE_TOOLS[cat.slug] || []

    // Generate ~100-150 items per category to reach 1000+
    const itemsPerCat = cat.slug === 'gen-ai' ? 50 : 120

    for (let i = 0; i < itemsPerCat; i++) {
      const baseTitle = pick(titles)
      const suffix = i > titles.length ? ` Vol. ${Math.ceil(i / titles.length)}` : ''
      const title = `${baseTitle}${suffix} ${i + 1}`
      const creator = pick(creators)
      const subcat = pick(subs)
      const downloads = rand(100, 50000)
      const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)) // 3.0–5.0
      const ratingCount = rand(5, 500)
      const seed = itemCount + 1

      const item = await prisma.item.create({
        data: {
          title,
          description: `A professional ${cat.name.toLowerCase()} asset — ${title}. Perfect for designers, marketers, and creators. High quality, fully customizable, and commercially licensed.`,
          categoryId: catEntry.id,
          subcategory: subcat,
          tags: pickMany([...catTags, subcat.toLowerCase(), cat.name.toLowerCase()], rand(3, 6)),
          thumbnailUrl: getThumbnail(seed, cat.slug),
          previewUrls: getPreviewUrls(seed, cat.slug),
          fileUrl: `https://r2.pipiklo.com/items/${cat.slug}-${i}.zip`,
          fileSize: `${rand(1, 150)} MB`,
          fileFormat: cat.slug === 'fonts' ? 'OTF/TTF' : cat.slug === 'audio' ? 'MP3/WAV' : cat.slug === 'photos' ? 'JPG/PNG' : cat.slug === 'video-templates' ? 'AEP/PRPROJ' : 'ZIP',
          isFree: true,
          creatorId: creator.id,
          status: ItemStatus.approved,
          downloads,
          views: downloads * rand(3, 8),
          rating,
          ratingCount,
          compatibleTools: tools.length > 0 ? pickMany(tools, rand(1, Math.min(3, tools.length))) : [],
          licenseType: 'standard',
        },
      })

      createdItems.push({ id: item.id, category: cat.slug })
      itemCount++
    }
    console.log(`✅ ${itemsPerCat} items created for ${cat.name} (total: ${itemCount})`)
  }

  // ── Create Subscriptions for Customers ────────────────────────────────────
  for (const customer of customers) {
    await prisma.subscription.create({
      data: {
        userId: customer.id,
        plan: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log('✅ Subscriptions created')

  // ── Create Sample Downloads & Licenses ────────────────────────────────────
  for (let i = 0; i < 30; i++) {
    const customer = pick(customers)
    const item = pick(createdItems)
    const licenseKey = `LIC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const download = await prisma.download.create({
      data: {
        userId: customer.id,
        itemId: item.id,
        licenseKey,
        projectName: `My Project ${i + 1}`,
        downloadedAt: new Date(Date.now() - rand(0, 30) * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.license.create({
      data: {
        userId: customer.id,
        itemId: item.id,
        downloadId: download.id,
        licenseKey,
        projectName: `My Project ${i + 1}`,
        certificateUrl: `https://r2.pipiklo.com/certificates/${licenseKey}.pdf`,
        isValid: true,
      },
    })
  }
  console.log('✅ Sample downloads & licenses created')

  // ── Creator Earnings ───────────────────────────────────────────────────────
  for (const creator of creators) {
    const creatorItems = createdItems.slice(0, rand(3, 10))
    for (const item of creatorItems) {
      await prisma.creatorEarning.create({
        data: {
          creatorId: creator.id,
          itemId: item.id,
          downloadCount: rand(10, 1000),
          totalEarned: parseFloat((rand(500, 50000) / 100).toFixed(2)),
          pendingPayout: parseFloat((rand(100, 5000) / 100).toFixed(2)),
          paidOut: parseFloat((rand(0, 20000) / 100).toFixed(2)),
        },
      }).catch(() => {})
    }
  }
  console.log('✅ Creator earnings created')

  console.log(`\n🎉 Seed complete! Created:
  - 1 admin
  - ${creators.length} creators
  - ${customers.length} customers
  - ${CATEGORIES.length} categories
  - ${itemCount} items
  - 30 sample downloads/licenses`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
