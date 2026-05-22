'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MoreVertical, Shield, User, Brush, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type UserStatus = 'active' | 'suspended' | 'banned'

interface MockUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  downloads: number
  items: number
  joined: string
  status: UserStatus
}

const INITIAL_USERS: MockUser[] = [
  { id: '1', name: 'Arjun Sharma', email: 'arjun@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', downloads: 0, items: 24, joined: '2025-01-15', status: 'active' },
  { id: '2', name: 'Priya Patel', email: 'priya@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', downloads: 0, items: 18, joined: '2025-02-20', status: 'active' },
  { id: '3', name: 'Customer 1', email: 'customer1@example.com', role: 'customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', downloads: 47, items: 0, joined: '2025-03-10', status: 'active' },
  { id: '4', name: 'Customer 2', email: 'customer2@example.com', role: 'customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', downloads: 23, items: 0, joined: '2025-04-05', status: 'active' },
  { id: '5', name: 'Rahul Kumar', email: 'rahul@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', downloads: 0, items: 31, joined: '2025-01-28', status: 'active' },
  { id: '6', name: 'Vikram Nair', email: 'vikram@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram', downloads: 0, items: 12, joined: '2025-05-01', status: 'suspended' },
]

const roleConfig = {
  admin: { label: 'Admin', icon: Shield, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
  creator: { label: 'Creator', icon: Brush, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
  customer: { label: 'Customer', icon: User, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
}

function UserActionsDropdown({
  user,
  onBan,
  onUnban,
  onRemove,
}: {
  user: MockUser
  onBan: () => void
  onUnban: () => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-1 rounded hover:bg-muted transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-background border rounded-xl shadow-lg w-44 py-1 text-sm">
          {user.status === 'banned' ? (
            <button
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-green-600"
              onClick={() => { setOpen(false); onUnban() }}
            >
              Unban User
            </button>
          ) : (
            <button
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-amber-600"
              onClick={() => { setOpen(false); onBan() }}
            >
              Ban User
            </button>
          )}
          <button
            className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-red-600"
            onClick={() => { setOpen(false); onRemove() }}
          >
            Remove Account
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS)
  const [actionUser, setActionUser] = useState<MockUser | null>(null)
  const [actionType, setActionType] = useState<'ban' | 'remove' | null>(null)

  const filtered = users.filter((u) => {
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
    const matchR = roleFilter === 'all' || u.role === roleFilter
    return matchQ && matchR
  })

  const openConfirm = (user: MockUser, type: 'ban' | 'remove') => {
    setActionUser(user)
    setActionType(type)
  }

  const closeConfirm = () => {
    setActionUser(null)
    setActionType(null)
  }

  const handleConfirm = () => {
    if (!actionUser || !actionType) return
    if (actionType === 'ban') {
      setUsers((prev) => prev.map((u) => u.id === actionUser.id ? { ...u, status: 'banned' as UserStatus } : u))
    } else if (actionType === 'remove') {
      setUsers((prev) => prev.filter((u) => u.id !== actionUser.id))
    }
    closeConfirm()
  }

  const handleUnban = (userId: string) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'active' as UserStatus } : u))
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground text-sm">Manage platform users and roles</p>
          </div>
          <Button variant="brand" size="sm">+ Invite User</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
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

        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Downloads / Items</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((user) => {
                const rc = roleConfig[user.role as keyof typeof roleConfig]
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rc.color}`}>
                        <rc.icon className="h-3 w-3" />
                        {rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.role === 'creator' ? `${user.items} items` : `${user.downloads} downloads`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.joined)}</td>
                    <td className="px-4 py-3">
                      {user.status === 'banned' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Banned
                        </span>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <UserActionsDropdown
                        user={user}
                        onBan={() => openConfirm(user, 'ban')}
                        onUnban={() => handleUnban(user.id)}
                        onRemove={() => openConfirm(user, 'remove')}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No users found</div>
          )}
          </div>
        </div>

      {/* Confirmation Dialog */}
      {actionUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {actionType === 'ban' ? 'Ban User?' : 'Remove Account?'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to {actionType === 'ban' ? 'ban' : 'remove'}{' '}
                  <span className="font-semibold text-foreground">{actionUser.name}</span>?
                  {actionType === 'remove' && ' This action cannot be undone.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={closeConfirm}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                {actionType === 'ban' ? 'Yes, ban user' : 'Yes, remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
