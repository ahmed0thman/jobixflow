import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, Shield, UserRound } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { NavItem } from '../../config/nav'

interface SidebarProps {
  productName?: string
  roleLabel: string
  nav: NavItem[]
  user: { name: string; email: string; initials: string }
}

export function Sidebar({ productName = 'JobixFlow', roleLabel, nav, user }: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-slate-200">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-bold text-slate-900">{productName}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 ml-10">{roleLabel}</p>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          // A nav item that is itself a URL-prefix of a sibling nav item (e.g. "Job History"
          // at /jobs vs. "New Job" at /jobs/create) must match exactly, or both would light up
          // together on the more specific sibling's route.
          const isPrefixOfSibling = nav.some((other) => other.path !== item.path && other.path.startsWith(`${item.path}/`))
          return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === nav[0]?.path || isPrefixOfSibling}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50',
              )
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
          </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3 relative">
        <button
          onClick={() => setUserMenuOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 text-left"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </button>
        {userMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <UserRound className="w-4 h-4" /> Edit Profile
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
