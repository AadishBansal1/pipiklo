import type { ItemCard, Item, User, Download, License } from '@pipiklo/types'

// ─── Seeded PRNG (fixes hydration mismatch — server & client get identical values) ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = mulberry32(42)

function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function pickMany<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => rng() - 0.5).slice(0, n)
}
function rand(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['gen-ai','video-templates','stock-video','audio','graphics','design-templates','photos','3d','fonts','web'] as const
type Cat = typeof CATEGORIES[number]

const SUBCATS: Record<Cat, string[]> = {
  'gen-ai': ['ImageGen','VideoGen','MusicGen','VoiceGen','GraphicsGen','MockupGen'],
  'video-templates': ['Logo Reveals','Broadcast Packages','Promos','Title Sequences','Video Intros','Elements'],
  'stock-video': ['Background','Nature','Business','Technology','Travel','Drone'],
  'audio': ['Background Music','Epic','Upbeat','Corporate','Gaming SFX','Futuristic'],
  'graphics': ['Icons','Illustrations','Backgrounds','Textures','Patterns','Objects'],
  'design-templates': ['Social Media','Product Mockups','Logos','Business Cards','Flyers','Presentations'],
  'photos': ['Business','Nature','Lifestyle','Technology','Beach','Food'],
  '3d': ['Models','Renders','Abstract','Nature','Transportation','Architecture'],
  'fonts': ['Serif','Sans-Serif','Script & Handwritten','Decorative'],
  'web': ['Admin Templates','Landing Pages','Site Templates','WordPress','eCommerce','Portfolio'],
}

const TITLES: Record<Cat, string[]> = {
  'gen-ai': ['Neural Dream Studio','AI Vision Pack','Prompt Master Kit','DeepStyle Generator','Synthwave Visuals','Portrait AI Studio','Landscape Dream AI','Creative AI Bundle'],
  'video-templates': ['Modern Broadcast Pack','Cinematic Logo Reveal','Corporate Promo Kit','Neon Title Sequence','Sports Broadcast','News Intro Package','Wedding Video Template','YouTube Intro Pack','Social Media Stories'],
  'stock-video': ['Urban City Timelapse','Mountain Sunset','Office Workers 4K','Tech Abstract Footage','Beach Waves 4K','Nature Forest Walk','Drone Cityscape','Business Meeting'],
  'audio': ['Epic Cinematic Score','Corporate Upbeat Track','Chill Lo-Fi Beats','Rock Energy Pack','Podcast Intro Music','Game SFX Bundle','UI Click Pack','Nature Ambience'],
  'graphics': ['Mega Icon Pack 5000','Watercolor Illustration Set','Gradient Backgrounds Pack','Halftone Textures','Line Art Collection','Food Icons Bundle','Abstract Shapes Kit','Pattern Design Pack'],
  'design-templates': ['Instagram Story Pack','Business Card Collection','Resume Template Pro','Corporate Brochure','Event Flyer Bundle','Brand Identity Kit','Social Media Mockup','Product Packaging'],
  'photos': ['Business Office Pack','Nature Photography Bundle','Fashion Lifestyle Photos','Food Photography Kit','Tech Abstract Photos','Travel Photography Set','Sky Backgrounds Pack','Paper Texture Bundle'],
  '3d': ['Modern Furniture Models','Car 3D Model Pack','Abstract 3D Renders','Architecture Visualization','Character 3D Bundle','Nature Tree Models','Product Mockup 3D','Sci-Fi Environment'],
  'fonts': ['Luxury Serif Family','Modern Sans-Serif Pro','Handwritten Script Bundle','Vintage Display Font','Clean Minimal Typeface','Bold Headline Font','Arabic Calligraphy','Retro Neon Font'],
  'web': ['SaaS Admin Dashboard','E-Commerce Landing','Portfolio One-Page','Blog WordPress Theme','Agency Website','App Landing Page','Corporate Site','Restaurant Website'],
}

const TAGS_BY_CAT: Record<Cat, string[]> = {
  'gen-ai': ['ai','generator','creative','neural','text-to-image'],
  'video-templates': ['after-effects','premiere-pro','motion','animation','broadcast'],
  'stock-video': ['4k','hd','footage','b-roll','cinematic'],
  'audio': ['royalty-free','music','sound','background','loop'],
  'graphics': ['vector','illustration','icon','svg','design'],
  'design-templates': ['template','print','digital','marketing','brand'],
  'photos': ['photography','stock-photo','hd','commercial','lifestyle'],
  '3d': ['3d','model','render','blender','visualization'],
  'fonts': ['font','typeface','typography','otf','ttf'],
  'web': ['html','css','react','responsive','ui-kit'],
}

const CREATORS: Pick<User,'id'|'name'|'avatar'>[] = [
  { id: 'c1', name: 'Arjun Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun' },
  { id: 'c2', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
  { id: 'c3', name: 'Rahul Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul' },
  { id: 'c4', name: 'Ananya Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya' },
  { id: 'c5', name: 'Vikram Nair', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram' },
  { id: 'c6', name: 'Sneha Reddy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
]

// ─── Generator (deterministic — same output on server & client) ───────────────

let _itemsCache: ItemCard[] | null = null

export function generateItems(count = 1200): ItemCard[] {
  if (_itemsCache) return _itemsCache
  const items: ItemCard[] = []
  let i = 0
  for (const cat of CATEGORIES) {
    const perCat = cat === 'gen-ai' ? 50 : Math.floor((count - 50) / (CATEGORIES.length - 1))
    const titles = TITLES[cat]; const subs = SUBCATS[cat]; const catTags = TAGS_BY_CAT[cat]
    for (let j = 0; j < perCat; j++) {
      const suffix = j >= titles.length ? ` Vol.${Math.ceil(j / titles.length)}` : ''
      const seed = i + 10
      items.push({
        id: `item-${i + 1}`,
        title: `${titles[j % titles.length]}${suffix}`,
        category: cat,
        subcategory: subs[i % subs.length],
        thumbnailUrl: `https://picsum.photos/seed/${seed}/400/300`,
        previewUrls: [
          `https://picsum.photos/seed/${seed}/800/600`,
          `https://picsum.photos/seed/${seed + 1}/800/600`,
          `https://picsum.photos/seed/${seed + 2}/800/600`,
        ],
        isFree: true,
        downloads: 200 + (i * 73) % 79800,
        rating: 3 + (i % 20) / 10,
        ratingCount: 10 + (i * 37) % 790,
        creator: CREATORS[i % CREATORS.length],
        tags: catTags.slice(0, 3 + (i % 3)),
        createdAt: new Date(Date.now() - ((i * 86400000 * 3) % (365 * 86400000))).toISOString(),
      })
      i++
    }
  }
  _itemsCache = items
  return items
}

export function getItemById(id: string): Item | null {
  const card = generateItems().find((x) => x.id === id)
  if (!card) return null
  const i = parseInt(id.replace('item-', '')) || 1
  return {
    ...card,
    description: `A premium ${card.category.replace('-', ' ')} asset — ${card.title}. Perfect for designers, marketers, and creative professionals. Fully customizable, commercially licensed, and ready to use in any project.`,
    fileSize: `${2 + (i % 148)} MB`,
    fileFormat: card.category === 'fonts' ? 'OTF/TTF' : card.category === 'audio' ? 'MP3/WAV' : card.category === 'photos' ? 'JPG/PNG' : 'ZIP',
    isFree: true,
    price: undefined,
    creatorId: card.creator?.id ?? 'c1',
    status: 'approved',
    views: (card.downloads ?? 0) * (3 + (i % 5)),
    licenseType: 'standard',
    compatibleTools: ['Adobe Photoshop','Figma','After Effects','Premiere Pro','Blender','Canva'].slice(0, 2 + (i % 4)),
    createdAt: card.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function getFeaturedItems(count = 12): ItemCard[] {
  return generateItems()
    .sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
    .slice(0, count)
}

export function getItemsByCategory(category: string, limit = 24, offset = 0): ItemCard[] {
  return generateItems()
    .filter((x) => x.category === category)
    .slice(offset, offset + limit)
}

export function searchItems(query: string, filters?: { category?: string; subcategory?: string }): ItemCard[] {
  const q = query.toLowerCase()
  return generateItems()
    .filter((item) => {
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.subcategory.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCat = !filters?.category || item.category === filters.category
      const matchesSub = !filters?.subcategory || item.subcategory === filters.subcategory
      return matchesQuery && matchesCat && matchesSub
    })
    .slice(0, 60)
}

export function getSimilarItems(itemId: string, count = 8): ItemCard[] {
  const item = generateItems().find((x) => x.id === itemId)
  if (!item) return []
  return generateItems().filter((x) => x.id !== itemId && x.category === item.category).slice(0, count)
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_STATS = {
  totalUsers: 12847, totalCreators: 384, totalItems: 1243, totalDownloads: 892410,
  totalRevenue: 1284750, pendingReviews: 23, activeSubscriptions: 3847,
  monthlyRevenue: [
    { month: 'Jun', revenue: 84000 },{ month: 'Jul', revenue: 96000 },{ month: 'Aug', revenue: 112000 },
    { month: 'Sep', revenue: 98000 },{ month: 'Oct', revenue: 134000 },{ month: 'Nov', revenue: 148000 },
    { month: 'Dec', revenue: 167000 },{ month: 'Jan', revenue: 142000 },{ month: 'Feb', revenue: 158000 },
    { month: 'Mar', revenue: 176000 },{ month: 'Apr', revenue: 192000 },{ month: 'May', revenue: 218000 },
  ],
  topCategories: [
    { category: 'Video Templates', downloads: 234000 },{ category: 'Design Templates', downloads: 187000 },
    { category: 'Graphics', downloads: 142000 },{ category: 'Fonts', downloads: 98000 },
    { category: 'Photos', downloads: 87000 },{ category: 'Audio', downloads: 76000 },
    { category: '3D', downloads: 45000 },{ category: 'Web', downloads: 23000 },
  ],
}

export const MOCK_CREATOR_STATS = {
  totalItems: 24, totalDownloads: 18742, totalViews: 124680, totalEarnings: 94284.5, pendingPayout: 12840.0,
  monthlyEarnings: [
    { month: 'Jun', earnings: 4200 },{ month: 'Jul', earnings: 5800 },{ month: 'Aug', earnings: 7200 },
    { month: 'Sep', earnings: 6400 },{ month: 'Oct', earnings: 8900 },{ month: 'Nov', earnings: 9800 },
    { month: 'Dec', earnings: 11200 },{ month: 'Jan', earnings: 9400 },{ month: 'Feb', earnings: 10800 },
    { month: 'Mar', earnings: 12400 },{ month: 'Apr', earnings: 13600 },{ month: 'May', earnings: 15200 },
  ],
  topItems: [
    { itemId: 'item-1', title: 'Modern Broadcast Pack', downloads: 4820, earnings: 24100 },
    { itemId: 'item-2', title: 'Mega Icon Pack 5000', downloads: 3640, earnings: 18200 },
    { itemId: 'item-3', title: 'Luxury Serif Family', downloads: 2980, earnings: 14900 },
    { itemId: 'item-4', title: 'Cinematic Logo Reveal', downloads: 2540, earnings: 12700 },
    { itemId: 'item-5', title: 'Corporate Promo Kit', downloads: 1920, earnings: 9600 },
  ],
}

export const MOCK_DOWNLOADS: Download[] = Array.from({ length: 15 }, (_, i) => ({
  id: `dl-${i + 1}`, userId: 'user-1', itemId: `item-${i + 1}`,
  item: generateItems()[i],
  licenseKey: `PIL-${(1000 + i).toString().padStart(4, '0')}-ABCD-EFGH-IJKL`,
  projectName: `My Project ${i + 1}`,
  downloadedAt: new Date(Date.now() - i * 3 * 86400000).toISOString(),
  certificateUrl: `https://r2.pipiklo.com/certificates/cert-${i + 1}.pdf`,
}))

export const MOCK_LICENSES: License[] = MOCK_DOWNLOADS.map((dl, i) => ({
  id: `lic-${i + 1}`, userId: 'user-1', itemId: dl.itemId,
  item: dl.item ? { id: dl.item.id, title: dl.item.title, thumbnailUrl: dl.item.thumbnailUrl, category: dl.item.category } : undefined,
  licenseKey: dl.licenseKey, projectName: dl.projectName ?? 'Untitled Project',
  certificateUrl: dl.certificateUrl, issuedAt: dl.downloadedAt, isValid: true,
}))
