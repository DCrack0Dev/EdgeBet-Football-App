import { Skeleton, CardSkeleton } from '@/components/LoadingSkeleton'

export default function HistoryLoading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-48 w-full bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
