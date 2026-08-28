import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter } from '../../components/ui/AdvancedFilter'
import { Button } from '../../components/ui/Button'
import { MoneyAmount } from '../../components/ui/MoneyAmount'
import { useToast } from '../../components/ui/Toast'
import { transactions as seedTransactions, companyAdminUser } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { transactionFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatDateTime } from '../../lib/utils'
import { TRANSACTION_TYPE_LABELS, type Transaction } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 12
const PRIMARY_KEYS = ['technicianName', 'type']

export function Transactions() {
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [page, setPage] = useState(1)

  // TEN-002 — company-scoped; no other company's transactions are reachable here.
  const myTransactions = useMemo(() => seedTransactions.filter((t) => t.companyId === MY_COMPANY_ID), [])

  const autoFields = useMemo(
    // Company is fixed for this role, so it is not a filter — it is the scope.
    () => inferFilterFields(myTransactions, { ...transactionFilterSchema, exclude: ['companyName'] }),
    [myTransactions],
  )
  const primaryFields = autoFields.filter((f) => PRIMARY_KEYS.includes(f.key))
  const advancedFields = autoFields.filter((f) => !PRIMARY_KEYS.includes(f.key))

  const filtered = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    return myTransactions.filter((t) => {
      if (from && t.createdAt < from) return false
      if (to && t.createdAt > to) return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.txnNumber.toLowerCase().includes(q) && !(t.technicianName ?? '').toLowerCase().includes(q) && !(t.customerName ?? '').toLowerCase().includes(q)) return false
      }
      return matchesAutoFilters(t, autoFields, filterValues)
    })
  }, [myTransactions, autoFields, filterValues, datePreset, customFrom, customTo, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function clearAll() {
    setFilterValues({})
    setDatePreset('all')
    setCustomFrom('')
    setCustomTo('')
    setPage(1)
  }

  const columns: Column<Transaction>[] = [
    { key: 'txn', header: 'Transaction #', render: (t) => <span className="font-mono text-xs text-slate-600">{t.txnNumber}</span> },
    { key: 'job', header: 'Job', render: (t) => t.jobId ? <span className="text-blue-600 text-xs font-medium">Linked</span> : <span className="text-slate-300 text-xs">—</span> },
    { key: 'invoice', header: 'Invoice', render: (t) => t.invoiceId ?? <span className="text-slate-300">—</span> },
    { key: 'technician', header: 'Technician', render: (t) => t.technicianName ?? <span className="text-slate-300">—</span> },
    { key: 'customer', header: 'Customer', render: (t) => t.customerName ?? <span className="text-slate-300">—</span> },
    { key: 'type', header: 'Type', render: (t) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{TRANSACTION_TYPE_LABELS[t.type]}</span> },
    { key: 'amount', header: 'Amount', render: (t) => <MoneyAmount amount={t.amount} size="sm" /> },
    { key: 'date', header: 'Date', sortable: true, render: (t) => <span className="text-xs text-slate-500">{formatDateTime(t.createdAt)}</span> },
    { key: 'user', header: 'Acting User', render: (t) => <span className="text-xs text-slate-500">{t.actingUser}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Financial Transactions"
        subtitle={`Every payment, fee, and payout for ${companyAdminUser.companyName}`}
        action={
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={() => show('Ledger exported to CSV.', 'info')}>
            Export
          </Button>
        }
      />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by transaction #, technician, or customer..."
          fields={[
            ...primaryFields,
            ...(datePreset === 'custom' ? [{ key: 'customRange', label: 'Date Range', type: 'dateRange' as const }] : []),
          ]}
          advancedFields={advancedFields}
          values={{ ...filterValues, customRange: { from: customFrom, to: customTo } }}
          onFieldChange={(key, value) => {
            if (key === 'customRange') {
              const range = (value as { from?: string; to?: string } | undefined) ?? {}
              setCustomFrom(range.from ?? ''); setCustomTo(range.to ?? '')
            } else setFilterValues((v) => ({ ...v, [key]: value }))
            setPage(1)
          }}
          quickFilters={DATE_RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label }))}
          activeQuickFilter={datePreset}
          onQuickFilterChange={(k) => { setDatePreset(k); setPage(1) }}
          onClearAll={clearAll}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(t) => t.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { clearAll(); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
