import type { ReactNode } from 'react'
import {
  LayoutDashboard, Building2, Briefcase, Wallet, Receipt, BarChart3,
  ScrollText, Globe, Users2, UserCog, Bell, Settings, PlusCircle, Wrench, History, Inbox, Map,
  KeyRound, KeySquare, Phone, Contact,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

const iconProps = { className: 'w-[18px] h-[18px]' }

export const platformAdminNav: NavItem[] = [
  { label: 'Dashboard', path: '/platform-admin', icon: <LayoutDashboard {...iconProps} /> },
  { label: 'Companies', path: '/platform-admin/companies', icon: <Building2 {...iconProps} /> },
  { label: 'Jobs', path: '/platform-admin/jobs', icon: <Briefcase {...iconProps} /> },
  { label: 'Platform Wallet', path: '/platform-admin/wallet', icon: <Wallet {...iconProps} /> },
  { label: 'Transactions', path: '/platform-admin/transactions', icon: <Receipt {...iconProps} /> },
  { label: 'Reports', path: '/platform-admin/reports', icon: <BarChart3 {...iconProps} /> },
  { label: 'Audit Log', path: '/platform-admin/audit-log', icon: <ScrollText {...iconProps} /> },
  { label: 'Countries', path: '/platform-admin/countries', icon: <Globe {...iconProps} /> },
  { label: 'Customer', path: '/platform-admin/customers', icon: <Users2 {...iconProps} /> },
  { label: 'Users', path: '/platform-admin/users', icon: <UserCog {...iconProps} /> },
  { label: 'Notifications', path: '/platform-admin/notifications', icon: <Bell {...iconProps} /> },
  { label: 'Settings', path: '/platform-admin/settings', icon: <Settings {...iconProps} /> },
]

export const platformDispatcherNav: NavItem[] = [
  { label: 'Dashboard', path: '/platform-dispatcher', icon: <LayoutDashboard {...iconProps} /> },
  { label: 'New Job', path: '/platform-dispatcher/jobs/create', icon: <PlusCircle {...iconProps} /> },
  { label: 'Service Types', path: '/platform-dispatcher/service-types', icon: <Wrench {...iconProps} /> },
  { label: 'Job History', path: '/platform-dispatcher/jobs', icon: <History {...iconProps} /> },
  { label: 'Companies', path: '/platform-dispatcher/companies', icon: <Building2 {...iconProps} /> },
  { label: 'Customers', path: '/platform-dispatcher/customers', icon: <Users2 {...iconProps} /> },
  { label: 'Audit Log', path: '/platform-dispatcher/audit-log', icon: <ScrollText {...iconProps} /> },
  { label: 'Notifications', path: '/platform-dispatcher/notifications', icon: <Bell {...iconProps} /> },
]

export const companyDispatcherNav: NavItem[] = [
  { label: 'Dashboard', path: '/company-dispatcher', icon: <LayoutDashboard {...iconProps} /> },
  { label: 'New Job', path: '/company-dispatcher/jobs/create', icon: <PlusCircle {...iconProps} /> },
  { label: 'Active Jobs', path: '/company-dispatcher/jobs', icon: <Briefcase {...iconProps} /> },
  { label: 'Incoming Jobs', path: '/company-dispatcher/incoming-jobs', icon: <Inbox {...iconProps} /> },
  { label: 'Technicians', path: '/company-dispatcher/technicians', icon: <Users2 {...iconProps} /> },
  { label: 'Live Map', path: '/company-dispatcher/map', icon: <Map {...iconProps} /> },
  { label: 'Notifications', path: '/company-dispatcher/notifications', icon: <Bell {...iconProps} /> },
]

export const companyAdminNav: NavItem[] = [
  { label: 'Dashboard', path: '/company-admin', icon: <LayoutDashboard {...iconProps} /> },
  { label: 'Company Wallet', path: '/company-admin/wallet', icon: <Wallet {...iconProps} /> },
  { label: 'Transactions', path: '/company-admin/transactions', icon: <Receipt {...iconProps} /> },
  { label: 'Code Requests', path: '/company-admin/code-requests', icon: <KeyRound {...iconProps} /> },
  { label: 'Technicians', path: '/company-admin/technicians', icon: <Users2 {...iconProps} /> },
  { label: 'Reports', path: '/company-admin/reports', icon: <BarChart3 {...iconProps} /> },
  { label: 'Key Codes', path: '/company-admin/key-codes', icon: <KeySquare {...iconProps} /> },
  { label: 'Jobs', path: '/company-admin/jobs', icon: <Briefcase {...iconProps} /> },
  { label: 'Notifications', path: '/company-admin/notifications', icon: <Bell {...iconProps} /> },
  { label: 'Customers', path: '/company-admin/customers', icon: <Contact {...iconProps} /> },
  { label: 'Users', path: '/company-admin/users', icon: <UserCog {...iconProps} /> },
  { label: 'Call Logs', path: '/company-admin/call-logs', icon: <Phone {...iconProps} /> },
  { label: 'Audit Log', path: '/company-admin/audit-log', icon: <ScrollText {...iconProps} /> },
  { label: 'Settings', path: '/company-admin/settings', icon: <Settings {...iconProps} /> },
]
