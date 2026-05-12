// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'customer' | 'creator'

export interface User {
  id: string
  clerkId: string
  role: UserRole
  name: string
  email: string
  avatar?: string
  bio?: string
  website?: string
  createdAt: string
  isVerified: boolean
  totalEarnings?: number
  payoutInfo?: PayoutInfo
}

export interface PayoutInfo {
  accountName: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  upiId?: string
  preferredMethod: 'bank' | 'upi'
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  itemCount: number
  children?: Category[]
}

export interface CategoryGroup {
  name: string
  slug: string
  icon: string
  description: string
  subcategories: {
    name: string
    slug: string
    count?: number
  }[]
  compatibleTools?: string[]
  topSearches?: string[]
}

// ─── Items ────────────────────────────────────────────────────────────────────

export type ItemStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export type ItemCategory =
  | 'gen-ai'
  | 'video-templates'
  | 'stock-video'
  | 'audio'
  | 'graphics'
  | 'design-templates'
  | 'photos'
  | '3d'
  | 'fonts'
  | 'web'

export interface Item {
  id: string
  title: string
  description: string
  category: ItemCategory
  subcategory: string
  tags: string[]
  thumbnailUrl: string
  previewUrls: string[]
  fileUrl?: string
  fileSize?: string
  fileFormat?: string
  isFree: boolean
  price?: number
  creatorId: string
  creator?: Pick<User, 'id' | 'name' | 'avatar'>
  status: ItemStatus
  downloads: number
  views: number
  rating: number
  ratingCount: number
  compatibleTools?: string[]
  createdAt: string
  updatedAt: string
  licenseType: 'standard' | 'extended'
}

export interface ItemCard
  extends Pick<
    Item,
    | 'id'
    | 'title'
    | 'category'
    | 'subcategory'
    | 'thumbnailUrl'
    | 'previewUrls'
    | 'isFree'
    | 'downloads'
    | 'rating'
    | 'ratingCount'
    | 'creator'
    | 'tags'
    | 'createdAt'
  > {}

// ─── Downloads & Licenses ─────────────────────────────────────────────────────

export interface Download {
  id: string
  userId: string
  itemId: string
  item?: ItemCard
  licenseKey: string
  projectName?: string
  downloadedAt: string
  certificateUrl?: string
}

export interface License {
  id: string
  userId: string
  itemId: string
  item?: Pick<Item, 'id' | 'title' | 'thumbnailUrl' | 'category'>
  licenseKey: string
  projectName: string
  certificateUrl?: string
  issuedAt: string
  isValid: boolean
}

// ─── Subscriptions & Payments ─────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'monthly' | 'annual' | 'team'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  razorpaySubId?: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  gateway: 'razorpay'
  status: 'pending' | 'success' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  metadata?: Record<string, unknown>
}

// ─── Creator Earnings ─────────────────────────────────────────────────────────

export interface CreatorEarning {
  id: string
  creatorId: string
  itemId: string
  item?: Pick<Item, 'id' | 'title' | 'thumbnailUrl'>
  downloadCount: number
  totalEarned: number
  pendingPayout: number
  paidOut: number
  lastDownloadAt?: string
}

export interface PayoutRequest {
  id: string
  creatorId: string
  amount: number
  status: 'pending' | 'processing' | 'paid' | 'rejected'
  requestedAt: string
  processedAt?: string
  notes?: string
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchParams {
  q?: string
  category?: ItemCategory
  subcategory?: string
  tags?: string[]
  isFree?: boolean
  minRating?: number
  compatibleTools?: string[]
  sortBy?: 'downloads' | 'rating' | 'newest' | 'relevance'
  page?: number
  limit?: number
}

export interface SearchResult {
  items: ItemCard[]
  total: number
  page: number
  totalPages: number
  facets?: {
    categories: { name: string; count: number }[]
    subcategories: { name: string; count: number }[]
    tags: { name: string; count: number }[]
    compatibleTools: { name: string; count: number }[]
  }
}

// ─── AI Tools ─────────────────────────────────────────────────────────────────

export type AITool =
  | 'image-gen'
  | 'image-edit'
  | 'video-gen'
  | 'music-gen'
  | 'voice-gen'
  | 'sound-gen'
  | 'graphics-gen'
  | 'mockup-gen'

export interface AIGenerationRequest {
  tool: AITool
  prompt: string
  options?: Record<string, unknown>
}

export interface AIGenerationResult {
  id: string
  tool: AITool
  prompt: string
  resultUrl: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  createdAt: string
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number
  totalCreators: number
  totalItems: number
  totalDownloads: number
  totalRevenue: number
  pendingReviews: number
  activeSubscriptions: number
  monthlyRevenue: { month: string; revenue: number }[]
  topCategories: { category: string; downloads: number }[]
}

export interface CreatorStats {
  totalItems: number
  totalDownloads: number
  totalViews: number
  totalEarnings: number
  pendingPayout: number
  monthlyEarnings: { month: string; earnings: number }[]
  topItems: { itemId: string; title: string; downloads: number; earnings: number }[]
}

export interface CustomerStats {
  totalDownloads: number
  activeLicenses: number
  savedCollections: number
  subscription?: Subscription
}

// ─── Collections ──────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  userId: string
  name: string
  itemIds: string[]
  items?: ItemCard[]
  createdAt: string
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  userId: string
  user?: Pick<User, 'id' | 'name' | 'avatar'>
  itemId: string
  rating: number
  comment?: string
  createdAt: string
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
