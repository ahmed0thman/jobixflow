import { useMemo, useState } from 'react'
import { ArrowRightLeft, Landmark, ShieldAlert, Wallet as WalletIcon } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter } from '../../components/ui/AdvancedFilter'
import { MoneyAmount } from '../../components/ui/MoneyAmount'
import { DateRangeFilter, getDateRangeBounds, type DateRangeKey } from '../../components/ui/DateRangeFilter'
import { companies, transactions } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { transactionFilterSchema } from '../../lib/filterSchemas'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { TRANSACTION_TYPE_LABELS, type Transaction } from '../../types'

const PAGE_SIZE = 10
const PRIMARY_KEYS = ['companyName', 'type']

export function Wallet() {
  const platformGatewayCompanies = companies.filter((c) => c.gatewayMode === 'platform')
  const platformGatewayIds = new Set(platformGatewayCompanies.map((c) => c.id))

  const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [page, setPage] = useState(1)

  const gatewayTxns = useMemo(
    () => transactions.filter((t) => platformGatewayIds.has(t.companyId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const walletTxns = useMemo(() => {
    const { from, to } = getDateRangeBounds(dateRange, customFrom, customTo)
    return gatewayTxns.filter((t) => {
      if (from && t.createdAt < from) return false
      if (to && t.createdAt > to) return false
      return true
    })
  }, [gatewayTxns, dateRange, customFrom, customTo])

  const autoFields = useMemo(() => inferFilterFields(gatewayTxns, transactionFilterSchema), [gatewayTxns])
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

  const held = walletTxns.filter((t) => t.type === 'customer_payment').reduce((s, t) => s + t.amount, 0)
  const disputesOpen = Math.abs(walletTxns.filter((t) => t.type === 'dispute').reduce((s, t) => s + t.amount, 0))
  const transferredOut = Math.abs(walletTxns.filter((t) => t.type === 'transfer_to_company').reduce((s, t) => s + t.amount, 0))
  const gatewayFees = Math.abs(walletTxns.filter((t) => t.type === 'gateway_fee').reduce((s, t) => s + t.amount, 0))

  const columns: Column<Transaction>[] = [
    { key: 'txn', header: 'Transaction #', render: (t) => <span className="font-mono text-xs text-slate-600">{t.txnNumber}</span> },
    { key: 'company', header: 'Company', render: (t) => t.companyName },
    { key: 'type', header: 'Type', render: (t) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{TRANSACTION_TYPE_LABELS[t.type]}</span> },
    { key: 'amount', header: 'Amount', render: (t) => <MoneyAmount amount={t.amount} size="sm" /> },
    { key: 'date', header: 'Date', sortable: true, render: (t) => <span className="text-xs text-slate-500">{formatDateTime(t.createdAt)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Platform Wallet" subtitle="Payments and balances across companies on the platform gateway" />

      <DateRangeFilter
        value={dateRange}
        onChange={setDateRange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<WalletIcon className="w-4.5 h-4.5" />} tone="blue" label="Customer Payments Held" value={formatCurrency(held)} />
        <KPITile icon={<Landmark className="w-4.5 h-4.5" />} tone="green" label="Transferred to Companies" value={formatCurrency(transferredOut)} />
        <KPITile icon={<ShieldAlert className="w-4.5 h-4.5" />} tone="red" label="Open Disputes" value={formatCurrency(disputesOpen)} />
        <KPITile icon={<ArrowRightLeft className="w-4.5 h-4.5" />} tone="amber" label="Gateway Fees Collected" value={formatCurrency(gatewayFees)} />
      </div>

      <Card className="mb-6">
        <CardHeader title="Company Balances" subtitle={`${platformGatewayCompanies.length} companies on the platform gateway`} />
        <div className="divide-y divide-slate-100">
          {platformGatewayCompanies.map((c) => {
            const balance = transactions.filter((t) => t.companyId === c.id && t.type === 'transfer_to_company').reduce((s, t) => s + Math.abs(t.amount), 0)
            return (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-800">{c.name}</span>
                <MoneyAmount amount={balance} positiveLabel="transferred to date" size="sm" />
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Ledger" subtitle="Full transaction history" />
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
