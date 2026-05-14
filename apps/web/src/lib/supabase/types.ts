export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'admin' | 'creator' | 'customer'
          bio: string | null
          website: string | null
          payout_info: Json
          total_earnings: number
          pending_payout: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['users']['Row']> & { id: string; email: string }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      items: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          subcategory: string | null
          tags: string[]
          preview_urls: string[]
          file_url: string | null
          thumbnail_url: string | null
          is_free: boolean
          price: number
          creator_id: string | null
          status: 'draft' | 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          downloads: number
          views: number
          rating: number
          rating_count: number
          compatible_tools: string[]
          file_size: string | null
          file_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['items']['Row']> & { title: string; category: string }
        Update: Partial<Database['public']['Tables']['items']['Row']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          icon: string | null
          description: string | null
          item_count: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['categories']['Row']> & { name: string; slug: string }
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          item_id: string
          license_key: string
          project_name: string | null
          downloaded_at: string
        }
        Insert: Partial<Database['public']['Tables']['downloads']['Row']> & { user_id: string; item_id: string }
        Update: Partial<Database['public']['Tables']['downloads']['Row']>
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          item_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & { user_id: string; item_id: string; rating: number }
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          item_ids: string[]
          is_public: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['collections']['Row']> & { user_id: string; name: string }
        Update: Partial<Database['public']['Tables']['collections']['Row']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'pro' | 'enterprise'
          status: 'active' | 'cancelled' | 'past_due' | 'trialing'
          razorpay_sub_id: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['subscriptions']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          gateway: string
          status: 'pending' | 'success' | 'failed' | 'refunded'
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['payments']['Row']> & { user_id: string; amount: number; status: string }
        Update: Partial<Database['public']['Tables']['payments']['Row']>
      }
      creator_earnings: {
        Row: {
          id: string
          creator_id: string
          item_id: string
          download_count: number
          total_earned: number
          pending_payout: number
          paid_out: number
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['creator_earnings']['Row']> & { creator_id: string; item_id: string }
        Update: Partial<Database['public']['Tables']['creator_earnings']['Row']>
      }
    }
  }
}
