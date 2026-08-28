import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Pagination } from './Pagination'
import { EmptyState, ErrorState, LoadingState, NoResultsState } from './States'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  keyField: (row: T) => string
  status?: 'ready' | 'loading' | 'error' | 'empty' | 'no-results'
  emptyTitle?: string
  emptyDescription?: string
  onRetry?: () => void
  onClearFilters?: () => void
  pagination?: {
    page: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
  }
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  density?: 'comfortable' | 'compact'
  rowSelected?: (row: T) => boolean
  stickyHeader?: boolean
  footerRow?: ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  keyField,
  status = 'ready',
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Once records exist, they will show up here.',
  onRetry,
  onClearFilters,
  pagination,
  sortKey,
  sortDir,
  onSort,
  density = 'comfortable',
  rowSelected,
  stickyHeader = true,
  footerRow,
}: DataTableProps<T>) {
  const cellPad = density === 'compact' ? 'px-4 py-2' : 'px-4 py-3'

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={cn('bg-slate-50 text-slate-500 text-xs uppercase tracking-wide', stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('text-left font-medium px-4 py-3 whitespace-nowrap', col.headerClassName)}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort?.(col.key)}
                      className="inline-flex items-center gap-1 hover:text-slate-700"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {status === 'ready' && (
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr
                  key={keyField(row)}
                  className={cn('hover:bg-slate-50/70 transition-colors', rowSelected?.(row) && 'bg-blue-50/50')}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn(cellPad, 'align-middle', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
          {status === 'ready' && footerRow && (
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-semibold text-slate-900">
              <tr>{footerRow}</tr>
            </tfoot>
          )}
        </table>
      </div>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState onRetry={onRetry} />}
      {status === 'empty' && <EmptyState title={emptyTitle} description={emptyDescription} />}
      {status === 'no-results' && <NoResultsState onClear={onClearFilters} />}

      {status === 'ready' && pagination && pagination.totalItems > 0 && <Pagination {...pagination} />}
    </div>
  )
}
