import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import type { NavItem } from '../../config/nav'

export function AppShell({ roleLabel, nav, user }: { roleLabel: string; nav: NavItem[]; user: { name: string; email: string; initials: string } }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar roleLabel={roleLabel} nav={nav} user={user} />
      <main className="flex-1 min-w-0 px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
