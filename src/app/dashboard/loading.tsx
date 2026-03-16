import { Skeleton, CardSkeleton, StatCardSkeleton } from '@/components/LoadingSkeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-32 h-16 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          </section>
        </div>
        <div className="space-y-12">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
