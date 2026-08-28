import { Info } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'

export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <Card className="p-10 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-600 max-w-md">This page isn't available yet.</p>
      </Card>
    </div>
  )
}
