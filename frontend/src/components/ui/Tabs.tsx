import { cn } from '../../lib/utils'

export interface TabConfig {
  key: string
  label: string
  count?: number
}

/** Underlined tab bar used to switch a page between report grains. */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabConfig[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-5">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative text-sm font-medium px-4 py-2.5 -mb-px border-b-2 transition-colors',
              isActive
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('ml-1.5 text-xs', isActive ? 'text-blue-500' : 'text-slate-400')}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
