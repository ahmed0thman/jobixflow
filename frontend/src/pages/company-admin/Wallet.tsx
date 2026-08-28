import { useMemo, useState } from 'react'
import { CreditCard, ShieldAlert, UserCheck, Wallet as WalletIcon } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter } from '../../components/ui/AdvancedFilter'
import { MoneyAmount } from '../../components/ui/MoneyAmount'
import { DateRangeFilter, getDateRangeBounds, type DateRangeKey } from '../../components/ui/DateRangeFilter'
import { transactions, technicians, companyAdminUser } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { transactionFilterSchema } from '../../lib/filterSchemas'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { TRANSACTION_TYPE_LABELS, type Transaction } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 10
const PRIMARY_KEYS = ['technicianName', 'type']

export function Wallet() {
  const roster = technicians.filter((t) => t.companyId === MY_COMPANY_ID)

  const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [page, setPage] = useState(1)

  const companyTxns = useMemo(
    () => transactions.filter((t) => t.companyId === MY_COMPANY_ID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const walletTxns = useMemo(() => {
    const { from, to } = getDateRangeBounds(dateRange, customFrom, customTo)
    return companyTxns.filter((t) => {
      if (from && t.createdAt < from) return false
      if (to && t.createdAt > to) return false
      return true
    })
  }, [companyTxns, dateRange, customFrom, customTo])

  const autoFields = useMemo(
    // Company is the scope for this role, not a filter.
    () => inferFilterFields(companyTxns, { ...transactionFilterSchema, exclude: ['companyName'] }),
    [companyTxns],
  )
  const primaryFields = autoFields.filter((f) => PRIMARY_KEYS.includes(f.key))
  const advancedFields = autoFields.filter((f) => !PRIMARY_KEYS.includes(f.key))

  const filtered = useMemo(() => {
    return walletTxns.filter((t) => {
      if (search) {
        const q = search.toLowerCase()
        if (!t.txnNumber.toLowerCase().includes(q) && !(t.technicianName ?? '').toLowerCase().includes(q) && !(t.customerName ?? '').toLowerCase().includes(q)) return false
      }
      return matchesAutoFilters(t, autoFields, filterValues)
    })
  }, [walletTxns, autoFields, filterValues, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cardPayments = walletTxns.filter((t) => t.type === 'customer_payment').reduce((s, t) => s + t.amount, 0)
  const gatewayFees = Math.abs(walletTxns.filter((t) => t.type === 'gateway_fee').reduce((s, t) => s + t.amount, 0))
  const disputesOpen = Math.abs(walletTxns.filter((t) => t.type === 'dispute').reduce((s, t) => s + t.amount, 0))
  const technicianPayouts = Math.abs(walletTxns.filter((t) => t.type === 'technician_payout').reduce((s, t) => s + t.amount, 0))

  const columns: Column<Transaction>[] = [
    { key: 'txn', header: 'Transaction #', render: (t) => <span className="font-mono text-xs text-slate-600">{t.txnNumber}</span> },
    { key: 'technician', header: 'Technician', render: (t) => t.technicianName ?? <span className="text-slate-300">—</span> },
    { key: 'type', header: 'Type', render: (t) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{TRANSACTION_TYPE_LABELS[t.type]}</span> },
    { key: 'amount', header: 'Amount', render: (t) => <MoneyAmount amount={t.amount} size="sm" /> },
    { key: 'date', header: 'Date', sortable: true, render: (t) => <span className="text-xs text-slate-500">{formatDateTime(t.createdAt)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Company Wallet" subtitle={`Card payments and balances for ${companyAdminUser.companyName}`} />

      <DateRangeFilter
        value={dateRange}
        onChange={setDateRange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<CreditCard className="w-4.5 h-4.5" />} tone="blue" label="Card Payments Collected" value={formatCurrency(cardPayments)} />
        <KPITile icon={<WalletIcon className="w-4.5 h-4.5" />} tone="amber" label="Gateway Fees" value={formatCurrency(gatewayFees)} />
        <KPITile icon={<ShieldAlert className="w-4.5 h-4.5" />} tone="red" label="Open Disputes" value={formatCurrency(disputesOpen)} />
        <KPITile icon={<UserCheck className="w-4.5 h-4.5" />} tone="green" label="Technician Payouts" value={formatCurrency(technicianPayouts)} />
      </div>

      <Card className="mb-6">
        <CardHeader title="Technician Balances" subtitle={`${roster.length} technicians`} />
        <div className="divide-y divide-slate-100">
          {roster.map((tech) => {
            const techTxns = transactions.filter((t) => t.companyId === MY_COMPANY_ID && t.technicianName === tech.name)
            const sumAbs = (type: string) => Math.abs(techTxns.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0))
            const balance = sumAbs('technician_commission') - sumAbs('dispatch_fee') - sumAbs('backcharge') - sumAbs('technician_payout')
            return (
              <div key={tech.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-800">{tech.name}</span>
                <MoneyAmount amount={balance} positiveLabel="owed to technician" negativeLabel="owed by technician" size="sm" />
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Ledger" subtitle="Full transaction history for your company" />
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by transaction #, technician, or customer..."
          fields={primaryFields}
          advancedFields={advancedFields}
          values={filterValues}
          onFieldChange={(key, value) => { setFilterValues((v) => ({ ...v, [key]: value })); setPage(1) }}
          onClearAll={() => { setFilterValues({}); setSearch(''); setPage(1) }}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(t) => t.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setFilterValues({}); setSearch(''); setPage(1) }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
