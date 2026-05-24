'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, MoreVertical, Shield, User, Brush, AlertTriangle, RefreshCw } from 'lucide-react'

type UserStatus = 'active' | 'suspended' | 'banned'

interface DbUser {
  id: string
  name: string
  email: string
  role: string
  avatar_url: string | null
  tokens: number
  total_downloads: number
  total_earnings: number
  created_at: string
  status: UserStatus
}

const roleConfig = {
  admin:    { label: 'Admin',    icon: Shield, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
  creator:  { label: 'Creator',  icon: Brush,  color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
  customer: { label: 'Customer', icon: User,   color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
}

function ActionsMenu({ user, onBan, onUnban }: { user: DbUser; onBan: () => void; onUnban: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button className="p-1 rounded hover:bg-muted transition-colors" onClick={() => setOpen((v) => !v)}>
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-background border rounded-xl shadow-lg w-40 py-1 text-sm">
          {user.status === 'banned' ? (
            <button className="w-full text-left px-4 py-2 hover:bg-muted text-green-600"
              onClick={() => { setOpen(false); onUnban() }}>Unban User</button>
          ) : (
            <button className="w-full text-left px-4 py-2 hover:bg-muted text-amber-600"
              onClick={() => { setOpen(false); onBan() }}>Suspend User</button>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DbUser[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionUser, setActionUser] = useState<DbUser | null>(null)
  const [actionType, setActionType] = useState<'ban' | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('id, name, email, role, avatar_url, tokens, total_downloads, total_earnings, created_at')
        .order('created_at', { ascending: false })
        .limit(500)
      setUsers((data ?? []).map((u) => ({ ...u, status: 'active' as UserStatus })))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter((u) => {
    const matchQ = !query || u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())
    const matchR = roleFilter === 'all' || u.role === roleFilter
    return matchQ && matchR
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">
            {loading ? 'Loading…' : `${users.length} total users on the platform`}
          </p>
        </div>
        <button onClick={loadUsers} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'admin', 'creator', 'customer'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${roleFilter === r ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="border rounded-xl overflow-hidden divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="shimmer w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="shimmer h-3 w-32 rounded" />
                <div className="shimmer h-2.5 w-44 rounded" />
              </div>
              <div className="shimmer h-6 w-20 rounded-full" />
              <div className="shimmer h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Tokens</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Downloads</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Earnings</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((u) => {
                  const rc = roleConfig[u.role as keyof typeof roleConfig] ?? roleConfig.customer
                  return (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                            alt={u.name ?? ''}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{u.name ?? 'Unnamed'}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rc.color}`}>
                          <rc.icon className="h-3 w-3" />
                          {rc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground font-medium">{u.tokens ?? 0}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{(u.total_downloads ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                        {Number(u.total_earnings ?? 0) > 0 ? `₹${Number(u.total_earnings).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td className="px-4 py-3">
                        <ActionsMenu
                          user={u}
                          onBan={() => { setActionUser(u); setActionType('ban') }}
                          onUnban={() => setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: 'active' } : x))}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      {actionUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Suspend {actionUser.name}?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  They will be marked as suspended in the system.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setActionUser(null); setActionType(null) }}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button
                onClick={() => {
                  setUsers((prev) => prev.map((u) => u.id === actionUser.id ? { ...u, status: 'banned' } : u))
                  setActionUser(null); setActionType(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Yes, suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
