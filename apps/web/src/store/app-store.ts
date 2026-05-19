import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'customer' | 'creator'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
}

export interface StoreItem {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  thumbnailUrl: string
  fileUrl?: string
  isFree: boolean
  price?: number
  status: 'pending' | 'approved' | 'rejected'
  creatorId: string
  creatorName: string
  downloads: number
  views: number
  rating: number
  ratingCount: number
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

interface AppStore {
  user: AuthUser | null
  items: StoreItem[]
  // Auth
  setUser: (user: AuthUser | null) => void
  login: (email: string, password: string) => { ok: boolean; error?: string }
  adminLogin: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  // Items
  submitItem: (item: Omit<StoreItem, 'id' | 'status' | 'downloads' | 'views' | 'rating' | 'ratingCount' | 'submittedAt'>) => void
  approveItem: (id: string) => void
  rejectItem: (id: string, reason: string) => void
  getPendingItems: () => StoreItem[]
  getApprovedItems: () => StoreItem[]
}

// ─── Seed pending items (demo creator submissions) ────────────────────────────

const SEED_ITEMS: StoreItem[] = [
  {
    id: 'si-1', title: 'Glassmorphism UI Kit 2025', description: 'Modern glass UI components for Figma and React.',
    category: 'design-templates', subcategory: 'Social Media', tags: ['figma','ui','glass','modern'],
    thumbnailUrl: 'https://picsum.photos/seed/glass1/400/300', isFree: true, status: 'pending',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 12, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'si-2', title: 'Neon Cyberpunk Backgrounds Pack', description: '30 high-res cyberpunk backgrounds for digital art.',
    category: 'graphics', subcategory: 'Backgrounds', tags: ['neon','cyberpunk','background','dark'],
    thumbnailUrl: 'https://picsum.photos/seed/cyber1/400/300', isFree: true, status: 'pending',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 8, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'si-3', title: 'Minimal Logo Templates Bundle', description: '50 minimal editable logo templates for Illustrator.',
    category: 'design-templates', subcategory: 'Logos', tags: ['logo','minimal','vector','brand'],
    thumbnailUrl: 'https://picsum.photos/seed/logo1/400/300', isFree: true, status: 'approved',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 342, views: 1840, rating: 4.7, ratingCount: 89,
    submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'si-4', title: 'Epic Orchestral Music Pack', description: '10 royalty-free epic orchestral tracks for film & games.',
    category: 'audio', subcategory: 'Epic', tags: ['orchestral','epic','cinematic','royalty-free'],
    thumbnailUrl: 'https://picsum.photos/seed/orch1/400/300', isFree: true, status: 'approved',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 218, views: 960, rating: 4.9, ratingCount: 54,
    submittedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'si-5', title: 'Low Quality Blurry Photos', description: 'Some random blurry photos.',
    category: 'photos', subcategory: 'Nature', tags: ['photo'],
    thumbnailUrl: 'https://picsum.photos/seed/blur1/400/300', isFree: true, status: 'rejected',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 3, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    rejectionReason: 'Poor image quality and insufficient description.',
  },
]

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      items: SEED_ITEMS,

      setUser: (user) => set({ user }),

      login: (email, password) => {
        // Legacy demo login — kept for fallback
        const demoUsers: Record<string, AuthUser> = {
          'customer@pipiklo.com': { id: 'u1', name: 'Aadi Customer', email: 'customer@pipiklo.com', role: 'customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer' },
          'creator@pipiklo.com': { id: 'u2', name: 'Priya Creator', email: 'creator@pipiklo.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator' },
        }
        const passwords: Record<string, string> = {
          'customer@pipiklo.com': 'customer123',
          'creator@pipiklo.com': 'creator123',
        }
        const user = demoUsers[email]
        if (!user) return { ok: false, error: 'No account found with this email.' }
        if (passwords[email] !== password) return { ok: false, error: 'Incorrect password.' }
        set({ user })
        return { ok: true }
      },

      adminLogin: (email, password) => {
        if (email === 'admin@pipiklo.com' && password === 'Admin@2025') {
          set({ user: { id: 'admin-root', name: 'Admin', email: 'admin@pipiklo.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' } })
          // Stamp session start for 5-minute auto-logout
          try { localStorage.setItem('pipiklo_session_start', String(Date.now())) } catch {}
          return { ok: true }
        }
        return { ok: false, error: 'Invalid admin credentials.' }
      },

      logout: () => {
        try { localStorage.removeItem('pipiklo_session_start') } catch {}
        set({ user: null })
      },

      submitItem: (item) => {
        const newItem: StoreItem = {
          ...item,
          id: `si-${Date.now()}`,
          status: 'pending',
          downloads: 0,
          views: 0,
          rating: 0,
          ratingCount: 0,
          submittedAt: new Date().toISOString(),
        }
        set((s) => ({ items: [newItem, ...s.items] }))
      },

      approveItem: (id) => {
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id ? { ...it, status: 'approved', reviewedAt: new Date().toISOString() } : it
          ),
        }))
      },

      rejectItem: (id, reason) => {
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id ? { ...it, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString() } : it
          ),
        }))
      },

      getPendingItems: () => get().items.filter((i) => i.status === 'pending'),
      getApprovedItems: () => get().items.filter((i) => i.status === 'approved'),
    }),
    { name: 'pipiklo-store' }
  )
)
