'use client'

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
  tokens: number       // downloadable token balance
  totalDownloads: number
  joinedAt: string
}

export interface Sale {
  id: string
  customerName: string
  customerEmail: string
  plan: 'Monthly' | 'Annual' | 'One-time'
  amount: number   // in INR
  gateway: 'razorpay' | 'manual' | 'upi'
  status: 'completed' | 'pending' | 'refunded'
  note?: string
  date: string     // ISO string
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
  tokenCost: number  // tokens required to download
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

export interface TokenPurchase {
  id: string
  userId: string
  tokens: number
  amount: number   // INR
  pack: string
  gateway: 'razorpay'
  date: string
}

interface AppStore {
  user: AuthUser | null
  items: StoreItem[]
  sales: Sale[]
  tokenPurchases: TokenPurchase[]
  // Auth
  setUser: (user: AuthUser | null) => void
  login: (email: string, password: string) => { ok: boolean; error?: string }
  adminLogin: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  // Tokens
  useToken: (count?: number) => boolean          // deduct tokens, returns false if insufficient
  addTokens: (count: number, pack?: string, amount?: number) => void
  getTokenBalance: () => number
  // Items
  submitItem: (item: Omit<StoreItem, 'id' | 'status' | 'downloads' | 'views' | 'rating' | 'ratingCount' | 'submittedAt'>) => void
  approveItem: (id: string) => void
  rejectItem: (id: string, reason: string) => void
  getPendingItems: () => StoreItem[]
  getApprovedItems: () => StoreItem[]
  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void
  updateSaleStatus: (id: string, status: Sale['status']) => void
  deleteSale: (id: string) => void
}

// ─── Seed pending items (demo creator submissions) ────────────────────────────

const SEED_ITEMS: StoreItem[] = [
  {
    id: 'si-1', title: 'Glassmorphism UI Kit 2025', description: 'Modern glass UI components for Figma and React.',
    category: 'design-templates', subcategory: 'Social Media', tags: ['figma','ui','glass','modern'],
    thumbnailUrl: 'https://picsum.photos/seed/glass1/400/300', isFree: false, tokenCost: 1, status: 'pending',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 12, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'si-2', title: 'Neon Cyberpunk Backgrounds Pack', description: '30 high-res cyberpunk backgrounds for digital art.',
    category: 'graphics', subcategory: 'Backgrounds', tags: ['neon','cyberpunk','background','dark'],
    thumbnailUrl: 'https://picsum.photos/seed/cyber1/400/300', isFree: false, tokenCost: 1, status: 'pending',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 8, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'si-3', title: 'Minimal Logo Templates Bundle', description: '50 minimal editable logo templates for Illustrator.',
    category: 'design-templates', subcategory: 'Logos', tags: ['logo','minimal','vector','brand'],
    thumbnailUrl: 'https://picsum.photos/seed/logo1/400/300', isFree: false, tokenCost: 1, status: 'approved',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 342, views: 1840, rating: 4.7, ratingCount: 89,
    submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'si-4', title: 'Epic Orchestral Music Pack', description: '10 royalty-free epic orchestral tracks for film & games.',
    category: 'audio', subcategory: 'Epic', tags: ['orchestral','epic','cinematic','royalty-free'],
    thumbnailUrl: 'https://picsum.photos/seed/orch1/400/300', isFree: false, tokenCost: 1, status: 'approved',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 218, views: 960, rating: 4.9, ratingCount: 54,
    submittedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'si-5', title: 'Low Quality Blurry Photos', description: 'Some random blurry photos.',
    category: 'photos', subcategory: 'Nature', tags: ['photo'],
    thumbnailUrl: 'https://picsum.photos/seed/blur1/400/300', isFree: false, tokenCost: 1, status: 'rejected',
    creatorId: 'u2', creatorName: 'Priya Creator', downloads: 0, views: 3, rating: 0, ratingCount: 0,
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    rejectionReason: 'Poor image quality and insufficient description.',
  },
]

// ─── Demo users ───────────────────────────────────────────────────────────────

const DEMO_USERS: Record<string, AuthUser> = {
  'customer@pipiklo.com': {
    id: 'u1', name: 'Aadi Customer', email: 'customer@pipiklo.com', role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
    tokens: 3, totalDownloads: 0, joinedAt: new Date().toISOString(),
  },
  'creator@pipiklo.com': {
    id: 'u2', name: 'Priya Creator', email: 'creator@pipiklo.com', role: 'creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
    tokens: 0, totalDownloads: 0, joinedAt: new Date().toISOString(),
  },
}
const DEMO_PASSWORDS: Record<string, string> = {
  'customer@pipiklo.com': 'customer123',
  'creator@pipiklo.com': 'creator123',
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      items: SEED_ITEMS,
      sales: [],
      tokenPurchases: [],

      setUser: (user) => set({ user }),

      login: (email, password) => {
        const user = DEMO_USERS[email]
        if (!user) return { ok: false, error: 'No account found with this email.' }
        if (DEMO_PASSWORDS[email] !== password) return { ok: false, error: 'Incorrect password.' }
        set({ user })
        return { ok: true }
      },

      adminLogin: (email, password) => {
        if (email === 'admin@pipiklo.com' && password === 'Admin@2025') {
          set({
            user: {
              id: 'admin-root', name: 'Admin', email: 'admin@pipiklo.com', role: 'admin',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              tokens: 999, totalDownloads: 0, joinedAt: new Date().toISOString(),
            },
          })
          try { localStorage.setItem('pipiklo_session_start', String(Date.now())) } catch {}
          return { ok: true }
        }
        return { ok: false, error: 'Invalid admin credentials.' }
      },

      logout: () => {
        try { localStorage.removeItem('pipiklo_session_start') } catch {}
        set({ user: null })
      },

      // ── Token methods ──────────────────────────────────────────────────────
      getTokenBalance: () => get().user?.tokens ?? 0,

      useToken: (count = 1) => {
        const u = get().user
        if (!u || u.tokens < count) return false
        set((s) => ({
          user: s.user ? { ...s.user, tokens: s.user.tokens - count, totalDownloads: s.user.totalDownloads + count } : null,
        }))
        return true
      },

      addTokens: (count, pack = 'Custom', amount = 0) => {
        set((s) => {
          const purchase: TokenPurchase = {
            id: `tp-${Date.now()}`, userId: s.user?.id ?? 'guest',
            tokens: count, amount, pack, gateway: 'razorpay', date: new Date().toISOString(),
          }
          return {
            user: s.user ? { ...s.user, tokens: s.user.tokens + count } : null,
            tokenPurchases: [purchase, ...s.tokenPurchases],
          }
        })
      },

      // ── Item methods ───────────────────────────────────────────────────────
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

      addSale: (sale) => {
        const newSale: Sale = { ...sale, id: `sale-${Date.now()}`, date: new Date().toISOString() }
        set((s) => ({ sales: [newSale, ...s.sales] }))
      },
      updateSaleStatus: (id, status) => {
        set((s) => ({ sales: s.sales.map((sale) => sale.id === id ? { ...sale, status } : sale) }))
      },
      deleteSale: (id) => {
        set((s) => ({ sales: s.sales.filter((sale) => sale.id !== id) }))
      },
    }),
    { name: 'pipiklo-store-v2' }   // bump key so old persisted data is cleared
  )
)
