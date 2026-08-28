import { useMemo, useState } from 'react'
import { KeyRound, Plus, Shield, Trash2, UserCog, Users2, Wrench } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { ActionsMenu } from '../../components/ui/ActionsMenu'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Input, Select } from '../../components/ui/Form'
import { useToast } from '../../components/ui/Toast'
import { staffUsers as seedStaffUsers, companyAdminUser } from '../../data/mock'
import { COUNTRY_OPTIONS, formatDateTime, nextId } from '../../lib/utils'
import type { StaffRole, StaffUser } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 12

const roleTone: Record<StaffRole, string> = {
  'Company Admin': 'bg-violet-100 text-violet-700',
  'Company Dispatcher': 'bg-blue-100 text-blue-700',
  Technician: 'bg-slate-100 text-slate-600',
}

const emptyForm = { firstName: '', lastName: '', username: '', email: '', role: 'Technician' as StaffRole, country: 'USA', phone: '', password: '', confirmPassword: '' }

export function Users() {
  const { show } = useToast()
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(seedStaffUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<StaffUser | null>(null)

  const myUsers = staffUsers.filter((u) => u.companyId === MY_COMPANY_ID)

  const filtered = useMemo(() => {
    return myUsers.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${u.firstName} ${u.lastName}`.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUsers, roleFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'role', label: 'Role', type: 'select', options: ['Company Admin', 'Company Dispatcher', 'Technician'].map((r) => ({ value: r, label: r })) },
  ]

  function handleCreate() {
    const newErrors: string[] = []
    if (!form.firstName.trim()) newErrors.push('firstName')
    if (!form.lastName.trim()) newErrors.push('lastName')
    if (!form.username.trim()) newErrors.push('username')
    if (!form.email.trim()) newErrors.push('email')
    if (!form.phone.trim()) newErrors.push('phone')
    if (!form.password) newErrors.push('password')
    if (form.password !== form.confirmPassword) newErrors.push('confirmPassword')
    if (newErrors.length > 0) { setErrors(newErrors); return }

    const user: StaffUser = {
      id: nextId('user'),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role,
      companyId: MY_COMPANY_ID,
      phone: form.phone.trim(),
      country: form.country,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    setStaffUsers((us) => [user, ...us])
    show(`${user.firstName} ${user.lastName} created as ${user.role}.`)
    setForm(emptyForm)
    setErrors([])
    setCreateOpen(false)
  }

  const columns: Column<StaffUser>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div>
          <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (u) => <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${roleTone[u.role]}`}>{u.role}</span> },
    { key: 'lastLogin', header: 'Last Login', render: (u) => <span className="text-xs text-slate-500">{u.lastLoginAt ? formatDateTime(u.lastLoginAt) : ''}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {u.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (u) => (
        <ActionsMenu
          items={[
            { key: 'edit', label: 'Edit', icon: <UserCog className="w-4 h-4" />, onClick: () => show('Edit isn\'t wired up in this prototype.', 'info') },
            { key: 'password', label: 'Edit Password', icon: <KeyRound className="w-4 h-4" />, onClick: () => show('Password reset isn\'t wired up in this prototype.', 'info') },
            {
              key: 'delete',
              label: 'Delete',
              icon: <Trash2 className="w-4 h-4" />,
              danger: true,
              separatorBefore: true,
              disabled: u.role === 'Company Admin' && u.email === companyAdminUser.email,
              disabledReason: 'You can\'t delete your own account',
              onClick: () => setDeleteTarget(u),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Admins, dispatchers, and technicians for your company — all in one place"
        action={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Create New
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Users2 className="w-4.5 h-4.5" />} tone="blue" label="Total Users" value={myUsers.length} />
        <KPITile icon={<Shield className="w-4.5 h-4.5" />} tone="violet" label="Admins" value={myUsers.filter((u) => u.role === 'Company Admin').length} />
        <KPITile icon={<UserCog className="w-4.5 h-4.5" />} tone="amber" label="Dispatchers" value={myUsers.filter((u) => u.role === 'Company Dispatcher').length} />
        <KPITile icon={<Wrench className="w-4.5 h-4.5" />} tone="green" label="Technicians" value={myUsers.filter((u) => u.role === 'Technician').length} />
      </div>

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by name or email..."
          fields={fields}
          values={{ role: roleFilter }}
          onFieldChange={(key, value) => { if (key === 'role') { setRoleFilter((value as string) ?? ''); setPage(1) } }}
          onClearAll={() => setRoleFilter('')}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(u) => u.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setRoleFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setErrors([]) }}
        title="Create New User"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setCreateOpen(false); setErrors([]) }}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create User</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} hint={errors.includes('firstName') ? 'Required' : undefined} />
          <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} hint={errors.includes('lastName') ? 'Required' : undefined} />
          <Input label="Username" required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} hint={errors.includes('username') ? 'Required' : undefined} />
          <Input label="Email Address" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} hint={errors.includes('email') ? 'Required' : undefined} />
          <Select label="Role" required value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as StaffRole }))}>
            <option value="Company Admin">Company Admin</option>
            <option value="Company Dispatcher">Company Dispatcher</option>
            <option value="Technician">Technician</option>
          </Select>
          <Select label="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
            {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} hint={errors.includes('phone') ? 'Required' : undefined} />
          <div />
          <Input label="Initial Password" required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} hint={errors.includes('password') ? 'Required' : undefined} />
          <Input label="Confirm Password" required type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} hint={errors.includes('confirmPassword') ? 'Passwords must match' : undefined} />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          setStaffUsers((us) => us.filter((u) => u.id !== deleteTarget.id))
          show(`${deleteTarget.firstName} ${deleteTarget.lastName} removed.`)
        }}
        title={`Delete ${deleteTarget?.firstName ?? ''} ${deleteTarget?.lastName ?? ''}?`}
        description="This account loses access immediately. This action can't be undone from this screen."
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  )
}
