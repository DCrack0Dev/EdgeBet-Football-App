import { Skeleton, CardSkeleton } from '@/components/LoadingSkeleton'

export default function AnalysisLoading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-14 w-80 rounded-2xl" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
